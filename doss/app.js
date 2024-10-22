const express = require('express');
const app = express();
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(express.static('./doss/css'));

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

app.get('/', function (req, res) {
  if (req.session.derece == 1) {
    res.render('app', {
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

app.post('/', function (req, res) {
  if (req.session.derece == 1) {
    res.render('app', {
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

app.post('/save', urlencodedParser, function (req, res) {
 if (req.session.derece == 1) {
  if (req.body.ad == undefined || req.body.ad == "") {
    res.render('hata', {
     oturum: req.session.isim,
     derece: req.session.derece,
     er: "Uygulama adı yazılmadı! Uygulama adı yazmak için Tıklayın..",
     sayfa: "/app",
     app: ap,
     opp: op
    });
  }
  if (req.body.adlar == undefined || req.body.adlar == "") {
    res.render('hata', {
     oturum: req.session.isim,
     derece: req.session.derece,
     er: "Uygulamanın çoğul adı yazılmadı! Uygulamanın çoğul adını yazmak için Tıklayın..",
     sayfa: "/app",
     app: ap,
     opp: op
    });
  }
  else {
    if (req.body.kategoriler == undefined || req.body.kategoriler == "#") {
      req.body.kategoriler = "";
      kategoriler = "";
    }
    else {
      kategoriler = req.body.kategoriler;
      kategoriler = kategoriler.split("i").join("İ").toUpperCase();
      kategoriler = kategoriler.replace("#", "");
    }

    let connection = mysql.createConnection(kon);
    let sqlSorgusu = `INSERT INTO app VALUES(NULL, ?, ?, ?);`;
    let veri = [req.body.ad, req.body.adlar, kategoriler];
    let sqlSorgusu12 = `SELECT * FROM app`;

    connection.connect(function (err) {
      if (err) throw err;
      console.log("\nMySQL 'e bağlanıldı.")

      connection.query(sqlSorgusu, veri, function (err, results) {
        if (err) throw err.message;
        console.log('Uygulama Ayarlandı.');

        connection.query(sqlSorgusu12, function (err, results) {
          if (err) throw err.message;
          if (results.length > 0) {
            ap = results[results.length-1];
            connection.end(function (err) {
              if (err) throw err;
              console.log('MySQL bağlantısı başarıyla kapatıldı.');
            });
            res.render('bildiri', {
              oturum: req.session.isim,
              derece: req.session.derece,
              er: "Uygulama Ayarlandı.",
              sayfa: "/stok",
              app: ap,
              opp: op
            });
          }
          else {
            ap = {id: 0, ad: 'App', adlar: 'App', kategoriler: ""}
            connection.end(function (err) {
              if (err) throw err;
              console.log('MySQL bağlantısı başarıyla kapatıldı.');
            });
            res.render('bildiri', {
              oturum: req.session.isim,
              derece: req.session.derece,
              er: "Uygulama Ayarlandı.",
              sayfa: "/stok",
              app: ap,
              opp: op
            });
          }
        });
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

module.exports = app;