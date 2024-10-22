const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const nodemailer = require('nodemailer');

app.use(express.static('./doss/css'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/admin', urlencodedParser, function (req, res) {
 if (req.session.derece == 1) {
  if (req.body.nick == undefined) {
    req.body.nick = "";
  }
  if (req.body.eposta == undefined) {
    req.body.eposta = "";
  }
  if (req.body.parola == undefined) {
    req.body.parola = "";
  }
  if (req.body.kutu == undefined) {
    req.body.kutu = "";
  }

  let veri = [];
  if (req.body.kutu == "kutu") { 
    veri = [req.body.nick, req.body.eposta, req.body.parola, '1'];
  }
  else {
    veri = [req.body.nick, req.body.eposta, req.body.parola, '2'];
  }

  let sqlSorgusu = `INSERT INTO users VALUES(NULL, ?, ?, ?, ?);`;
  let sorgula = `SELECT * FROM users WHERE nick = ?`;
  let sorgula2 = `SELECT * FROM users WHERE eposta = ?`;

  let connection = mysql.createConnection(kon);

  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sorgula, veri[0], function (err, results) {
      if (err) throw err.message;
      a = results;
      if (a.length > 0) {
        connection.end(function (err) {
          if (err) throw err;
          console.log('İsim benzerliği!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });

        b = 'veri adında bir üye var. Başka bir isimle kaydetmek için Tıklayın..'
        b = b.replace("veri", veri[0]);
        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: b,
          sayfa: "/hesap/yeni",
          app: ap,
          opp: op
        });
      }
      else if (veri[0] == "") {
        connection.end(function (err) {
          if (err) throw err;
          console.log('İsim alanı boş!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });

        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "İsim alanı boş. Bir isim yazmak için Tıklayın..",
          sayfa: "/hesap/yeni",
          app: ap,
          opp: op
        });
      }
      else if (veri[1] == "") {
        connection.end(function (err) {
          if (err) throw err;
          console.log('E-posta yazılmadı!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });
        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "E-posta yazmadınız. Yazmak için Tıklayın..",
          sayfa: "/hesap/yeni",
          app: ap,
          opp: op
        });
      }
      else if (veri[2] == "") {
        connection.end(function (err) {
          if (err) throw err;
          console.log('Şifre yazılmadı!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });
        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "Şifre yazmadınız. Lütfen bir şifre yazmak için Tıklayın..",
          sayfa: "/hesap/yeni",
          app: ap,
          opp: op
        });
      }
      else {
       connection.query(sorgula2, veri[1], function (err, results) {
        if (err) throw err.message;
        a = results;
        if (a.length > 0) {
          connection.end(function (err) {
            if (err) throw err;
            console.log('Eposta benzerliği!');
            console.log('MySQL bağlantısı başarıyla kapatıldı.');
          });

          b = 'veri e-posta adresi mevcud. Başka bir e-posta adresi ile kaydetmek için Tıklayın..'
          b = b.replace("veri", veri[1]);
          res.render('hata', {
            oturum: req.session.isim,
            derece: req.session.derece,
            er: b,
            sayfa: "/hesap/yeni",
            app: ap,
            opp: op
          });
        }
        else {
          connection.query(sqlSorgusu, veri, function (err, results) {
            if (err) throw err.message;
            console.log('%s kayıt oldu.', veri[0]);
          });
          connection.end(function (err) {
            if (err) throw err;
            console.log('MySQL bağlantısı başarıyla kapatıldı.');
          });
          
          res.render('bildiri', {
           oturum: req.session.isim,
           derece: req.session.derece,
           er: veri[0] + " hesabı oluşturuldu.",
           sayfa: "/",
           app: ap,
           opp: op
          });
        }
       });
      }
    });
  });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.post('/yeni', urlencodedParser, function (req, res) {
 if (req.session.derece == 1) {
    res.render('admin', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.get('/yeni', urlencodedParser, function (req, res) {
 if (req.session.derece == 1) {
    res.render('admin', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.post('/update', urlencodedParser, function (req, res) {
 if (req.session.isim != null) {
  if (req.body.nick != "") {
   if (req.body.parola != "") {
    if (req.body.eparola != "") {

     let connection = mysql.createConnection(kon);

     let sqlSorgusu = `UPDATE users SET nick = ?, parola = ? WHERE nick = ?`;
     let veri = [req.body.nick, req.body.parola, req.session.isim]
     let sorgula = `SELECT * FROM users WHERE nick = ?`;

     connection.connect(function (err) {
      if (err) throw err;
      console.log("\nMySQL 'e bağlanıldı.")

      connection.query(sorgula, veri[2], function (err, results) {
       if (err) throw err.message;
       if (results[0].parola == req.body.eparola) {

        connection.query(sorgula, veri[0], function (err, results) {
         if (err) throw err.message;
         if (results.length == 0) {
           connection.query(sqlSorgusu, veri, function (err, results) {
            if (err) throw err.message;

            if (results.affectedRows > 0) {
             if (err) {
              connection.end(function (err) {
               if (err) throw err;
               console.log('hata! hesap güncellenemedi..');
               console.log('MySQL bağlantısı başarıyla kapatıldı.');

               res.render('hata', {
                oturum: req.session.isim,
                derece: req.session.derece,
                er: "Hesap güncellenemedi! Tekrar denemek için Tıklayın..",
                sayfa: "/hesap/pass",
                app: ap,
                opp: op
               });
              });
             }

             req.session.isim = req.body.nick;
             connection.end(function (err) {
              console.log('Hesap güncellendi.');
              console.log('MySQL bağlantısı başarıyla kapatıldı.');

              res.render('bildiri', {
               oturum: req.session.isim,
               derece: req.session.derece,
               er: "*Hesap Güncellendi.",
               sayfa: "/",
               app: ap,
               opp: op
              });
             });
            }
           });
          }
          else if (results[0].nick == req.session.isim) {
           connection.query(sqlSorgusu, veri, function (err, results) {
            if (err) throw err.message;

            if (results.affectedRows > 0) {
             if (err) {
              connection.end(function (err) {
               if (err) throw err;
               console.log('hata! hesap güncellenemedi..');
               console.log('MySQL bağlantısı başarıyla kapatıldı.');

               res.render('hata', {
                oturum: req.session.isim,
                derece: req.session.derece,
                er: "Hesap güncellenemedi! Tekrar denemek için Tıklayın..",
                sayfa: "/hesap/pass",
                app: ap,
                opp: op
               });
              });
             }

             req.session.isim = req.body.nick;
             connection.end(function (err) {
              console.log('Hesap güncellendi.');
              console.log('MySQL bağlantısı başarıyla kapatıldı.');

              res.render('bildiri', {
               oturum: req.session.isim,
               derece: req.session.derece,
               er: "*Hesap Güncellendi.",
               sayfa: "/",
               app: ap,
               opp: op
              });
             });
            }
           });
          }

          else {
           connection.end(function (err) {
            console.log('MySQL bağlantısı başarıyla kapatıldı.');

            res.render('hata', {
             oturum: req.session.isim,
             derece: req.session.derece,
             er: "Kullanıcı adı zaten var! Yeni bir ad yazmak için Tıklayın..",
             sayfa: "/hesap/pass",
             app: ap,
             opp: op
            });
           });
          }
        });
       }
       else {
        connection.end(function (err) {
         console.log('Hata! Parola yanlış..');
         console.log('MySQL bağlantısı başarıyla kapatıldı.');

         res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "Parola Yanlış! Tekrar yazmak için Tıklayın..",
          sayfa: "/hesap/pass",
          app: ap,
          opp: op
         });
        });
       }

      });
     });
    }
    else {
     res.render('hata', {
      oturum: req.session.isim,
      derece: req.session.derece,
      er: "Parolanızı yazmadınız! Tekrar denemek için Tıklayın..",
      sayfa: "/hesap/pass",
      app: ap,
      opp: op
     });
    }
   }
   else {
    res.render('hata', {
     oturum: req.session.isim,
     derece: req.session.derece,
     er: "Yeni parola yazmadınız! Tekrar yazmak için Tıklayın..",
     sayfa: "/hesap/pass",
     app: ap,
     opp: op
    });
   }
  }
  else {
    res.render('hata', {
     oturum: req.session.isim,
     derece: req.session.derece,
     er: "Yeni kullanıcı adı yazmadınız! Tekrar yazmak için Tıklayın..",
     sayfa: "/hesap/pass",
     app: ap,
     opp: op
    });
  }
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.get('/pass', function (req, res) {
 if (req.session.isim != null) {
    res.render('pass', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.post('/pass', function (req, res) {
 if (req.session.isim != null) {
    res.render('pass', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.post('/delete', urlencodedParser, function (req, res) {
 if (req.session.derece == 1) {

  let connection = mysql.createConnection(kon);
  
  veri = req.body.sil;
  let sorgu = 'DELETE FROM users WHERE id = ver;';

  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")
    
    if (typeof veri == "object") {
      for (var i = 0; i < veri.length; i++) {
        sorgu = 'DELETE FROM users WHERE id = ver;';
        sorgu = sorgu.replace("ver", veri[i]);

        connection.query(sorgu, function (err, results) {
          if (err) {
            console.log("Hata! Üye silinemedi..");
          }
          else {
          console.log("*Üye silindi.");
          }
        });
      }
    }
    else {
        sorgu = 'DELETE FROM users WHERE id = ' + veri + ';';
        connection.query(sorgu, function (err, results) {
          if (err) {
            console.log("Hata! Üye silinemedi..");
          }
          else{
          console.log("*Üye silindi.");
          }
        });
    }

    connection.end(function (err) {
      if (err) throw err;
      console.log('MySQL bağlantısı başarıyla kapatıldı.');
      res.redirect("/hesap/users");
    });

  });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.get('/users', function (req, res) {
 if (req.session.derece == 1) {
  let connection = mysql.createConnection(kon);

  let sqlSorgusu = `SELECT * FROM users`;

  connection.connect(function (err) {
   if (err) throw err;
   console.log("\nMySQL 'e bağlanıldı.")

   connection.query(sqlSorgusu, function (err, results) {
    if (err) throw err.message;

    no = "";
    for (var i =0; i < results.length;  i++) {
      no = no + "*" + results[i].id;
    };
    all = "";
    for (var i =0; i < results.length;  i++) {
      all = all + "*" + results[i].nick;
    };
    epos = "";
     for (var i =0; i < results.length;  i++) {
      epos = epos + "*" + results[i].eposta;
     };
    pas = "";
     for (var i =0; i < results.length;  i++) {
      pas = pas + "*" + results[i].parola;
     };
    sev = "";
    for (var i =0; i < results.length;  i++) {
      sev = sev + "*" + results[i].seviye;
    };

    console.log("Tüm üyeler okundu.")

    connection.end(function (err) {
      if (err) throw err;
      console.log('MySQL bağlantısı başarıyla kapatıldı.');
    });

    res.render('users', {
      oturum: req.session.isim,
      derece: req.session.derece,
      no: no,
      all: all,
      epos: epos,
      pas: pas,
      sev: sev,
      app: ap,
      opp: op
    });
  });
 });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.post('/users', function (req, res) {
 if (req.session.derece == 1) {
  let connection = mysql.createConnection(kon);

  let sqlSorgusu = `SELECT * FROM users`;

  connection.connect(function (err) {
   if (err) throw err;
   console.log("\nMySQL 'e bağlanıldı.")

   connection.query(sqlSorgusu, function (err, results) {
    if (err) throw err.message;
    console.log("Tüm üyeler okundu.")

    connection.end(function (err) {
      if (err) throw err;
      console.log('MySQL bağlantısı başarıyla kapatıldı.');
    });

    no = "";
    for (var i =0; i < results.length;  i++) {
      no = no + "*" + results[i].id;
    };
    all = "";
    for (var i =0; i < results.length;  i++) {
      all = all + "*" + results[i].nick;
    };
    epos = "";
     for (var i =0; i < results.length;  i++) {
      epos = epos + "*" + results[i].eposta;
     };
    pas = "";
     for (var i =0; i < results.length;  i++) {
      pas = pas + "*" + results[i].parola;
     };
    sev = "";
    for (var i =0; i < results.length;  i++) {
      sev = sev + "*" + results[i].seviye;
    };

    res.render('users', {
      oturum: req.session.isim,
      derece: req.session.derece,
      no: no,
      all: all,
      epos: epos,
      pas: pas,
      sev: sev,
      app: ap,
      opp: op
    });
  });
 });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.get('/', function (req, res) {
 if (req.session.isim == null) {
    res.render('hesap', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.post('/register', urlencodedParser, function (req, res) {
 if (req.session.isim == null) {
  if (req.body.nick == undefined) {
    req.body.nick = "";
  }
  if (req.body.eposta == undefined) {
    req.body.eposta = "";
  }
  if (req.body.parola == undefined) {
    req.body.parola = "";
  }
  
  let transporter = nodemailer.createTransport(tran);

  let connection2 = mysql.createConnection(kon);

  transporter.verify(function (error, success) {
    if (error) {
      console.log('Site e-posta adresine erişim bağlanamadı!.');
    }
    else {
      console.log('Site e-posta adresine bağlandı.');
    }
  });

  kod = Math.random().toString().substring(2,8);
  text1 = "E-posta adresiniz ile imajajans.com 'a üyelik başvurusu yapılmıştır.\nEğer sizin isteğinizle gerçekleşmişse üye olmak için aşağıdaki onay kodunu sitemize yazmalısınız.\n\nOnay Kodu: ";

  let sqlSorgusu2 = `INSERT INTO onaylar VALUES(NULL, ?, ?, ?);`;
  let sqlSorgusu3 = `SELECT * FROM onaylar WHERE eposta = ?`;
  let sqlSorgusu4 = `UPDATE onaylar SET kod = ?, deneme = ? WHERE eposta = ?`;
  let veri2 = [req.body.eposta, kod, "sfr"];
  let veri3 = [kod, "sfr", req.body.eposta];

  connection2.connect(function (err) {
    if (err) throw err;
    console.log("\n2*MySQL 'e bağlanıldı.")

    connection2.query(sqlSorgusu3, veri2[0], function (err, results) {
      if (err) throw err.message;

      if (results.length == 0) {
        connection2.query(sqlSorgusu2, veri2, function (err, results) {
          if (err) throw err.message;
          connection2.end(function (err) {
            if (err) throw err;
            console.log('2*0Onay kodu kaydedildi.');
            console.log('2.1*MySQL bağlantısı başarıyla kapatıldı.');
          });
        });
      }
      else {
        connection2.query(sqlSorgusu4, veri3, function (err, results) {
          if (err) throw err.message;

          if (results.affectedRows > 0) {
           if (err) {
            connection2.end(function (err) {
              if (err) throw err;
              console.log('2.0*hata! kod güncellenemedi..');
              console.log('2.1*MySQL bağlantısı başarıyla kapatıldı.');

              res.render('hata', {
                oturum: req.session.isim,
                derece: req.session.derece,
                er: "Kod tekrar gönderilemedi. Yeniden kayıt olmak için Tıklayın..",
                sayfa: "/hesap",
                app: ap,
                opp: op
              });
            });
           }
          }
          connection2.end(function (err) {
            if (err) throw err;
            console.log('2.0*Onay kodu güncellendi.');
            console.log('2.1*MySQL bağlantısı başarıyla kapatıldı.');
          });
        });
      }
    });
  });

  let bilgiler = {
    to: req.body.eposta,
    subject: 'E-posta Doğrulama',
    text: text1 + kod
  };

  let sqlSorgusu = `INSERT INTO users VALUES(NULL, ?, ?, ?, ?);`;
  let veri = [req.body.nick, req.body.eposta, req.body.parola, '2']
  let sorgula = `SELECT * FROM users WHERE nick = ?`;
  let sorgula2 = `SELECT * FROM users WHERE eposta = ?`;
  let connection = mysql.createConnection(kon);
  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sorgula, veri[0], function (err, results) {
      if (err) throw err.message;
      a = results;
      if (a.length > 0) {
        connection.end(function (err) {
          if (err) throw err;
          console.log('İsim benzerliği!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });

        b = 'veri adında bir üye var. Başka bir isimle kaydolmak için Tıklayın..'
        b = b.replace("veri", veri[0]);
        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: b,
          sayfa: "/hesap",
          app: ap,
          opp: op
        });
      }
      else if (veri[0] == "") {
        connection.end(function (err) {
          if (err) throw err;
          console.log('İsim alanı boş!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });

        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "İsim alanı boş. Bir isim yazmak için Tıklayın..",
          sayfa: "/hesap",
          app: ap,
          opp: op
        });
      }
      else if (veri[1] == "") {
        connection.end(function (err) {
          if (err) throw err;
          console.log('E-posta yazılmadı!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });
        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "E-posta yazmadınız. Yazmak için Tıklayın..",
          sayfa: "/hesap",
          app: ap,
          opp: op
        });
      }
      else if (veri[2] == "") {
        connection.end(function (err) {
          if (err) throw err;
          console.log('Şifre yazılmadı!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });
        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "Şifre yazmadınız. Lütfen bir şifre yazmak için Tıklayın..",
          sayfa: "/hesap",
          app: ap,
          opp: op
        });
      }
      else {
       connection.query(sorgula2, veri[1], function (err, results) {
        if (err) throw err.message;
        a = results;
        if (a.length > 0) {
          connection.end(function (err) {
            if (err) throw err;
            console.log('Eposta benzerliği!');
            console.log('MySQL bağlantısı başarıyla kapatıldı.');
          });

          b = 'veri e-posta adresi mevcud. Başka bir e-posta adresi ile kaydolmak için Tıklayın..'
          b = b.replace("veri", veri[1]);
          res.render('hata', {
            oturum: req.session.isim,
            derece: req.session.derece,
            er: b,
            sayfa: "/hesap",
            app: ap,
            opp: op
          });
        }
        else {
          transporter.sendMail(bilgiler, function (error, info) {
            if (error) {
              connection.end(function (err) {
                if (err) throw err;
                console.log('MySQL bağlantısı başarıyla kapatıldı.');
              });

              console.log('*E-posta gönderilemedi!.');

              res.render('hata', {
                oturum: req.session.isim,
                derece: req.session.derece,
                er: "E-posta gönderilemedi. Daha sonra tekrar deneyin..",
                sayfa: "/hesap",
                app: ap,
                opp: op
              });
            }
            else {
              connection.end(function (err) {
                if (err) throw err;
                console.log('MySQL bağlantısı başarıyla kapatıldı.');
              });

              console.log('*E-posta gönderildi.');

              res.render('onay', {
               oturum: req.session.isim,
               derece: req.session.derece,
               veri: veri,
               app: ap,
               opp: op
              });
            }
          });
        }
       });
      }
    });
    });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

app.post('/end', urlencodedParser, function (req, res) {
 if (req.session.isim == null) {
  if (req.body.eposta == undefined) {
    req.body.eposta = "";
  }
  let connection = mysql.createConnection(kon);

  let sqlSorgusu = `INSERT INTO users VALUES(NULL, ?, ?, ?, ?);`;
  let sorgula2 = `SELECT * FROM onaylar WHERE eposta = ?`;
  let veri = [req.body.nick, req.body.eposta, req.body.parola, '2'];
  let onay = req.body.onay;

  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sorgula2, veri[1], function (err, results) {
     if (err) {console.log(err)};
     if (results.length > 0) {
     if (results[0].deneme == "sfr") {
      kodum = results[0].kod;
      tex = "UPDATE onaylar SET kod = 'kodum', deneme = 'bir' WHERE eposta = 'veri[1]'".replace("kodum", kodum);
      tex = tex.replace("veri[1]", veri[1]);

      connection.query(tex, function (err, results) {
       if (err) {console.log(err)};

       if (onay == kodum) {
          connection.query(sqlSorgusu, veri, function (err, results) {
            if (err) throw err.message;
            console.log('%s kayıt oldu.', veri[0]);
          });
          connection.end(function (err) {
            if (err) throw err;
            console.log('MySQL bağlantısı başarıyla kapatıldı.');
          });
          res.render('bildiri', {
           oturum: req.session.isim,
           derece: req.session.derece,
           er: veri[0] + " hesabı oluşturuldu. Giriş yapmak için Tıklayın.",
           sayfa: "/login",
           app: ap,
           opp: op
          });
       }
       else {
        connection.end(function (err) {
          if (err) throw err;
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });

        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "Kod yanlış. Tekrar kayıt olmak için Tıklayın..",
          sayfa: "/hesap",
          app: ap,
          opp: op
        });
       }
      });
     }
     else {
        connection.end(function (err) {
          if (err) throw err;
          console.log('Kod tekrar yazıldı.');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });

        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "Yeni hesap oluşturun..",
          sayfa: "/hesap",
          app: ap,
          opp: op
        });
     }
     }
     else {
        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "Yeni hesap oluşturun..",
          sayfa: "/hesap",
          app: ap,
          opp: op
        });
     }
    });
  });
 }
 else {
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
 }
});

module.exports = app;