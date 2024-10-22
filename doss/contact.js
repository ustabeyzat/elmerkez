const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

app.use(express.static('./doss/css'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function (req, res) {
  let connection = mysql.createConnection(kon);

  let sorgula = "SELECT * FROM contact;";

  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sorgula, function (err, results) {
      if (err) throw err.message;
      if (results[results.length-1] == undefined) {
        results[results.length-1] = ""
      }

      connection.end(function (err) {
        if (err) throw err;
        console.log('Sayfaya yönlendirildi!');
        console.log('MySQL bağlantısı başarıyla kapatıldı.');
      });

      res.render('contact', {
        oturum: req.session.isim,
        derece: req.session.derece,
        contacts: results[results.length-1],
        app: ap,
        opp: op
      });
    });
  });
});

app.post('/options', function (req, res) {
  if (req.session.derece == 1) {
   let connection = mysql.createConnection(kon);

   let sorgula = "SELECT * FROM contact;";

   connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sorgula, function (err, results) {
      if (err) throw err.message;
      if (results[results.length-1] == undefined) {
        results[results.length-1] = ""
      }

      connection.end(function (err) {
        if (err) throw err;
        console.log('iletişim tablosu alındı.');
        console.log('MySQL bağlantısı başarıyla kapatıldı.');
      });
      res.render('opticon', {
       oturum: req.session.isim,
       derece: req.session.derece,
       contacts: results[results.length-1],
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

app.get('/options', function (req, res) {
  if (req.session.derece == 1) {
   let connection = mysql.createConnection(kon);

   let sorgula = "SELECT * FROM contact;";

   connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sorgula, function (err, results) {
      if (err) throw err.message;
      if (results[results.length-1] == undefined) {
        results[results.length-1] = ""
      }

      connection.end(function (err) {
        if (err) throw err;
        console.log('iletişim tablosu alındı.');
        console.log('MySQL bağlantısı başarıyla kapatıldı.');
      });
      res.render('opticon', {
       oturum: req.session.isim,
       derece: req.session.derece,
       contacts: results[results.length-1],
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

app.post('/options/save', urlencodedParser, function (req, res) {
  if (req.session.derece == 1) {
   let connection = mysql.createConnection(kon);
   let sqlSorgusu = `INSERT INTO contact VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
   let veri = [req.body.gsm, req.body.posta, req.body.face, req.body.twit, req.body.ins, req.body.letgo, req.body.linked, req.body.tube, req.body.twitch, req.body.adres, req.body.harita];

   connection.connect(function (err) {
      if (err) throw err;
      console.log("\nMySQL 'e bağlanıldı.")

      connection.query(sqlSorgusu, veri, function (err, results) {
        if (err) throw err.message;
        console.log('İletişim bilgileri kaydedildi.');
      });

      connection.end(function (err) {
        if (err) throw err;
        console.log('MySQL bağlantısı başarıyla kapatıldı.');

        res.redirect('/contact');
      });
    })
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

app.post('/messaj', urlencodedParser, function (req, res) {
 if (req.session.mesaj != "send") {
  let transporter = nodemailer.createTransport(tran);
  var bag = "yok";
  transporter.verify(function (error, success) {
    if (error) {
      console.log('Site e-posta adresine erişim engellendi!.');
    }
    else {
      console.log('Site e-posta adresine bağlandı.');
      bag = "var";
    }
  });

  if (req.body.isim == "" || req.body.isim == undefined) {
    res.render('hata', {
      oturum: req.session.isim,
      derece: req.session.derece,
      er: "İsim yazmadınız. İsim yazmak için Tıklayın.",
      sayfa: "/contact",
      app: ap,
      opp: op
    });
  }
  else if (req.body.eposta == "" || req.body.eposta == undefined) {
    res.render('hata', {
      oturum: req.session.isim,
      derece: req.session.derece,
      er: "İletişim adresi belirtmediniz. Yazmak için Tıklayın.",
      sayfa: "/contact",
      app: ap,
      opp: op
    });
  }
  else if (req.body.mesaj == "" || req.body.mesaj == undefined) {
    res.render('hata', {
      oturum: req.session.isim,
      derece: req.session.derece,
      er: "Mesaj yazmadınız. Yazmak için Tıklayın.",
      sayfa: "/contact",
      app: ap,
      opp: op
    });
  }
  else if (req.body.site == "" || req.body.site == undefined) {
    res.render('hata', {
      oturum: req.session.isim,
      derece: req.session.derece,
      er: "Hata! Siteye tanımlı e-posta mevcud değil. Mesajınız iletilemedi.",
      sayfa: "/",
      app: ap,
      opp: op
    });
  }
  else if (req.body.isim == "veri[1]") {
    res.render('hata', {
      oturum: req.session.isim,
      derece: req.session.derece,
      er: "Hatalı mesaj engellendi. Anasayfaya gitmek için Tıklayın.",
      sayfa: "/",
      app: ap,
      opp: op
    });
  }
  else if (req.body.isim == "veri[2]") {
    res.render('hata', {
      oturum: req.session.isim,
      derece: req.session.derece,
      er: "Hatalı mesaj engellendi. Anasayfaya gitmek için Tıklayın.",
      sayfa: "/",
      app: ap,
      opp: op
    });
  }
  else if (req.body.eposta == "veri[2]") {
    res.render('hata', {
      oturum: req.session.isim,
      derece: req.session.derece,
      er: "Hatalı mesaj engellendi. Anasayfaya gitmek için Tıklayın.",
      sayfa: "/",
      app: ap,
      opp: op
    });
  }
  else {
    veri = [req.body.isim, req.body.eposta, req.body.mesaj, req.body.site];
    text1 = "İsim: veri[0]\nİletişim: veri[1]\n\nveri[2]".replace("veri[0]", veri[0]);
    text1 = text1.replace("veri[1]", veri[1]);
    text1 = text1.replace("veri[2]", veri[2]);
    
    let bilgiler = {
      to: "imajcnclazer@gmail.com",
      subject: 'Web Sitenizden Mesaj Geldi..',
      text: text1
    };

    transporter.sendMail(bilgiler, function (error, info) {
      if (error) {
        console.log('*E-posta gönderilemedi!.');
        if (bag == "var") {
        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "E-posta gönderilemedi. Daha sonra tekrar deneyin..",
          sayfa: "/contact",
          app: ap,
          opp: op
        });
        }
        else {
        res.render('hata', {
          oturum: req.session.isim,
          derece: req.session.derece,
          er: "Site e-postasına bağlanamadı. Daha sonra tekrar deneyin..",
          sayfa: "/contact",
          app: ap,
          opp: op
        });
        }
      }
      else {
        req.session.mesaj = "send";
        console.log('*E-postaya mesaj gönderildi.');

        res.render('bildiri', {
         oturum: req.session.isim,
         derece: req.session.derece,
         er: "Mesajınız iletildi. Anasayfaya gitmek için Tıklayın.",
         sayfa: "/",
         app: ap,
         opp: op
        });
      }
    });
  }
 }
 else {
  res.render('hata', {
    oturum: req.session.isim,
    derece: req.session.derece,
    er: "Daha önce mesaj gönderdiniz. Anasayfaya gitmek için Tıklayın.",
    sayfa: "/",
    app: ap,
    opp: op
  });
 }
});
module.exports = app;
