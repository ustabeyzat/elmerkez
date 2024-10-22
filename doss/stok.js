const express = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

app.use(express.static('./doss/css'));
app.use(express.static('./doss/uploads'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/search', urlencodedParser, function (req, res) {
  liste = req.body.liste;
  arama = req.body.arama;

  if (liste == "") {
    etiket = arama.split("i").join("İ").toUpperCase();
    etiket = etiket.split(" ").join("");
    bulunan = [];
    if (etiket.length == 0) {
      res.redirect("/stok"); 
    }
    else {
    let connection = mysql.createConnection(kon);
    
    let sqlSorgusu = `SELECT * FROM stok`;

    connection.connect(function (err) {
      if (err) throw err;
      console.log("\nMySQL 'e bağlanıldı.")
    
      connection.query(sqlSorgusu, function (err, results) {
        if (err) throw err.message;

        for (var i = 0; i < results.length; i++) {
          etik = results[i].etiket.split(" ");
          for (var n = 0; n < etik.length; n++) {
            if (etiket == etik[n]) {
              bulunan.push(results[i]);
            }
          }
        }  
        connection.end(function (err) {
          if (err) throw err;
          console.log('MySQL bağlantısı başarıyla kapatıldı.');

          res.render('search', {
            oturum: req.session.isim,
            derece: req.session.derece,
            veri: arama,
            bulunan: bulunan,
            app: ap,
            opp: op
          });      
        });
      });
    });
    }
  }
  else {
    etiket = liste.split("i").join("İ").toUpperCase();
    etiket = etiket.split(" ").join("");
    bulunan = [];

    let connection = mysql.createConnection(kon);
    
    let sqlSorgusu = `SELECT * FROM stok`;

    connection.connect(function (err) {
      if (err) throw err;
      console.log("\nMySQL 'e bağlanıldı.")
    
      connection.query(sqlSorgusu, function (err, results) {
        if (err) throw err.message;

        for (var i = 0; i < results.length; i++) {
          etik = results[i].etiket.split(" ");
          for (var n = 0; n < etik.length; n++) {
            if (etiket == etik[n]) {
              bulunan.push(results[i]);
            }
          }
        }  
        connection.end(function (err) {
          if (err) throw err;
          console.log('MySQL bağlantısı başarıyla kapatıldı.');

          res.render('search', {
            oturum: req.session.isim,
            derece: req.session.derece,
            veri: liste,
            bulunan: bulunan,
            app: ap,
            opp: op
          });      
        });
      });
    });

  }
});

app.get('/', function (req, res) {
 let connection = mysql.createConnection(kon);

 let sqlSorgusu = `SELECT * FROM stok`;

 connection.connect(function (err) {
  if (err) throw err;
  console.log("\nMySQL 'e bağlanıldı.")

  connection.query(sqlSorgusu, function (err, results) {
    if (err) throw err.message;

    stoks = "";
    for (var i =0; i < results.length;  i++) {
      stoks = stoks + "*" + results[i].title;
    };
    ids = "";
    for (var i =0; i < results.length;  i++) {
      ids = ids + "*" + results[i].id;
    };
     imgs = "";
     for (var i =0; i < results.length;  i++) {
      imgs = imgs + "*" + results[i].dosya.split("*")[1];
     };

    console.log("Tüm ürünler okundu.")

    connection.end(function (err) {
      if (err) throw err;
      console.log('MySQL bağlantısı başarıyla kapatıldı.');
    });

    res.render('stok', {
      oturum: req.session.isim,
      derece: req.session.derece,
      stok: stoks,
      id: ids,
      img: imgs,
      app: ap,
      opp: op
    });
  });
 });
});

app.post('/', function (req, res) {
 let connection = mysql.createConnection(kon);

 let sqlSorgusu = `SELECT * FROM stok`;

 connection.connect(function (err) {
  if (err) throw err;
  console.log("\nMySQL 'e bağlanıldı.")

  connection.query(sqlSorgusu, function (err, results) {
    if (err) throw err.message;
    console.log("Tüm ürünler okundu.")

    connection.end(function (err) {
      if (err) throw err;
      console.log('MySQL bağlantısı başarıyla kapatıldı.');
    });

    stoks = "";
    for (var i =0; i < results.length;  i++) {
      stoks = stoks + "*" + results[i].title;
    };
    ids = "";
    for (var i =0; i < results.length;  i++) {
      ids = ids + "*" + results[i].id;
    };
     imgs = "";
     for (var i =0; i < results.length;  i++) {
      imgs = imgs + "*" + results[i].dosya.split("*")[1];
     };

    res.render('stok', {
      oturum: req.session.isim,
      derece: req.session.derece,
      stok: stoks,
      id: ids,
      img: imgs,
      app: ap,
      opp: op
    });
  });
 });
});

module.exports = app;
