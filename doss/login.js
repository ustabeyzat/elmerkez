const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const nodemailer = require('nodemailer');

app.use(express.static('./doss/css'));

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

app.post('/unut', urlencodedParser, function (req, res) {
 if (req.session.isim == null) {
    if (req.body.nick == undefined || req.body.nick == "") {
      res.render('hata', {
        oturum: req.session.isim,
        derece: req.session.derece,
        er: "Kullanıcı adınızı yazın..",
        sayfa: "/login/unuttum",
        app: ap,
        opp: op
      });
    }
    else if (req.body.eposta == undefined || req.body.eposta == "") {
      res.render('hata', {
        oturum: req.session.isim,
        derece: req.session.derece,
        er: "E-posta adresinizi yazın..",
        sayfa: "/login/unuttum",
        app: ap,
        opp: op
      });
    }
    else {
      let connection = mysql.createConnection(kon);

      let sorgula = `SELECT * FROM users WHERE nick = ?`;
      veri = [req.body.nick, req.body.eposta];

      connection.connect(function (err) {
        if (err) throw err;
        console.log("\nMySQL 'e bağlanıldı.")

        connection.query(sorgula, veri[0], function (err, results) {
          if (err) throw err.message;
          if (results.length > 0) {
           a = results[0].eposta;
           if (a == veri[1]) {
             connection.end(function (err) {
               if (err) throw err;
               console.log('e-posta doğrulandı.');
               console.log('MySQL bağlantısı başarıyla kapatıldı.');
             });

             let transporter = nodemailer.createTransport(tran);

             transporter.verify(function (error, success) {
               if (error) {
                 console.log('Site e-posta adresine erişim engellendi!.');
               }
               else {
                 console.log('Site e-posta adresine bağlandı.');
               }
             });

             let bilgiler = {
               to: veri[1],
               subject: 'Üyelik İşlemleri',
               text: "elmerkez.com üyelik parolanız: " + results[0].parola
             };

             transporter.sendMail(bilgiler, function (error, info) {
               if (error) {
                 console.log('*Parola e-postaya gönderilemedi!.');

                 res.render('hata', {
                   oturum: req.session.isim,
                   derece: req.session.derece,
                   er: "E-posta gönderilemedi. Daha sonra tekrar deneyin..",
                   sayfa: "/login/unuttum",
                   app: ap,
                   opp: op
                 });
               }
               else {
                 console.log('*Parola e-postaya gönderildi.');

                 res.render('bildiri', {
                  oturum: req.session.isim,
                  derece: req.session.derece,
                  er: veri[1] + " adresine şifreniz gönderildi. Giriş yapmak için Tıklayın.",
                  sayfa: "/login",
                  app: ap,
                  opp: op
                 });
               }
             });
           }
           else {
              connection.end(function (err) {
                if (err) throw err;
                console.log('e-posta yanlış!');
                console.log('MySQL bağlantısı başarıyla kapatıldı.');
              });

              res.render('hata', {
                oturum: req.session.isim,
                derece: req.session.derece,
                er: "E-posta adresi veya Kullanıcı adı hatalı!",
                sayfa: "/login/unuttum",
                app: ap,
                opp: op
              });
           }
          }
          else {
            connection.end(function (err) {
              if (err) throw err;
              console.log('nick yanlış!');
              console.log('MySQL bağlantısı başarıyla kapatıldı.');
            });

            res.render('hata', {
              oturum: req.session.isim,
              derece: req.session.derece,
              er: "E-posta adresi veya Kullanıcı adı hatalı!",
              sayfa: "/login/unuttum",
              app: ap,
              opp: op
            });
          }
        });
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

app.post('/unutt', urlencodedParser, function (req, res) {
 if (req.session.isim == null) {
    if (req.body.eposta == undefined || req.body.eposta == "") {
      res.render('hata', {
        oturum: req.session.isim,
        derece: req.session.derece,
        er: "E-posta adresinizi yazın..",
        sayfa: "/login/unuttu",
        app: ap,
        opp: op
      });
    }
    else if (req.body.parola == undefined || req.body.parola == "") {
      res.render('hata', {
        oturum: req.session.isim,
        derece: req.session.derece,
        er: "Parolanızı yazın..",
        sayfa: "/login/unuttu",
        app: ap,
        opp: op
      });
    }
    else {
      let connection = mysql.createConnection(kon);

      let sorgula = `SELECT * FROM users WHERE eposta = ?`;
      veri = [req.body.eposta, req.body.parola];

      connection.connect(function (err) {
        if (err) throw err;
        console.log("\nMySQL 'e bağlanıldı.")

        connection.query(sorgula, veri[0], function (err, results) {
          if (err) throw err.message;
          if (results.length > 0) {
           a = results[0].parola;
           if (a == veri[1]) {
             connection.end(function (err) {
               if (err) throw err;
               console.log('parola doğrulandı.');
               console.log('MySQL bağlantısı başarıyla kapatıldı.');
             });

             let transporter = nodemailer.createTransport(tran);

             transporter.verify(function (error, success) {
               if (error) {
                 console.log('Site e-posta adresine erişim engellendi!.');
               }
               else {
                 console.log('Site e-posta adresine bağlandı.');
               }
             });

             let bilgiler = {
               to: veri[0],
               subject: 'Üyelik İşlemleri',
               text: "elmerkez.com kullanıcı adınız: " + results[0].nick
             };

             transporter.sendMail(bilgiler, function (error, info) {
               if (error) {
                 console.log('*Nick e-postaya gönderilemedi!.');

                 res.render('hata', {
                   oturum: req.session.isim,
                   derece: req.session.derece,
                   er: "Kullanıcı adınız gönderilemedi. Daha sonra tekrar deneyin..",
                   sayfa: "/login/unuttu",
                   app: ap,
                   opp: op
                 });
               }
               else {
                 console.log('*Nick e-postaya gönderildi.');

                 res.render('bildiri', {
                  oturum: req.session.isim,
                  derece: req.session.derece,
                  er: veri[0] + " adresine kullanıcı adınız gönderildi. Giriş yapmak için Tıklayın.",
                  sayfa: "/login",
                  app: ap,
                  opp: op
                 });
               }
             });
           }
           else {
              connection.end(function (err) {
                if (err) throw err;
                console.log('parola yanlış!');
                console.log('MySQL bağlantısı başarıyla kapatıldı.');
              });

              res.render('hata', {
                oturum: req.session.isim,
                derece: req.session.derece,
                er: "E-posta veya Parola yanlış!",
                sayfa: "/login/unuttu",
                app: ap,
                opp: op
              });
           }
          }
          else {
            connection.end(function (err) {
              if (err) throw err;
              console.log('e-posta yanlış!');
              console.log('MySQL bağlantısı başarıyla kapatıldı.');
            });

            res.render('hata', {
              oturum: req.session.isim,
              derece: req.session.derece,
              er: "E-posta veya Parola yanlış!",
              sayfa: "/login/unuttu",
              app: ap,
              opp: op
            });
          }
        });
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

app.get('/unuttum', function (req, res) {
 if (req.session.isim == null) {
    res.render('unuttum', {
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

app.post('/unuttum', function (req, res) {
 if (req.session.isim == null) {
    res.render('unuttum', {
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

app.get('/unuttu', function (req, res) {
 if (req.session.isim == null) {
    res.render('unuttu', {
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

app.post('/unuttu', function (req, res) {
 if (req.session.isim == null) {
    res.render('unuttu', {
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

app.get('/', function (req, res) {
 if (req.session.isim == null) {
    res.render('login', {
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

app.post('/signin', urlencodedParser, function (req, res) {
 if (req.session.isim == null) {
  let connection = mysql.createConnection(kon);

  let sorgula = `SELECT * FROM users WHERE nick = ?`;
  let parola = `SELECT * FROM users WHERE parola = ?`;
  let veri = [];
  if (req.body.nick != undefined) {
    veri = [req.body.nick, req.body.parola];
  }
  else {
    req.body.nick = "";
    veri = [req.body.nick, req.body.parola];
  }

  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sorgula, veri[0], function (err, results) {
      if (err) throw err.message;
      if (results.length > 0) {
       a = results[0].parola;
       if (a == veri[1]) {
         connection.end(function (err) {
           if (err) throw err;
           console.log('%s giriş yaptı.', veri[0]);
           console.log('MySQL bağlantısı başarıyla kapatıldı.');
         });
         req.session.isim = veri[0];
         req.session.derece = results[0].seviye;
         if (req.session.derece == 1) {
           res.redirect('/settings');
         }
         else {
           res.redirect('/');
         }
       }
       else {
         connection.end(function (err) {
           if (err) throw err;
           console.log('Parola yanlış!');
           console.log('MySQL bağlantısı başarıyla kapatıldı.');
         });
          res.render('hata', {
            oturum: req.session.isim,
            derece: req.session.derece,
            er: "Kullanıcı Adı veya Parola yanlış. Tekrar giriş yapmak için Tıklayın..",
            sayfa: "/login",
            app: ap,
            opp: op
          });
       }
      }
      else {
         connection.end(function (err) {
           if (err) throw err;
           console.log('İsim yanlış!');
           console.log('MySQL bağlantısı başarıyla kapatıldı.');
         });
          res.render('hata', {
            oturum: req.session.isim,
            derece: req.session.derece,
            er: "Kullanıcı Adı veya Parola yanlış. Tekrar giriş yapmak için Tıklayın..",
            sayfa: "/login",
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