const express = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs')

app.use(express.static('./doss/css'));
app.use(express.static('./doss/uploads'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/save', urlencodedParser, function(req, res) {
 if (req.session.isim != null) {
   veri = req.body.sil;
   isim = req.session.isim;
   yorum = req.body.yorum;

  let connection = mysql.createConnection(kon);

  let sqlSorgusu = `INSERT INTO yorumlar VALUES(NULL, ?, ?, ?);`;
  let veriler = [veri, isim, yorum];

  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sqlSorgusu, veriler, function (err, results) {
      if (err) throw err.message;
      console.log('Yorum eklendi.');
    });

    connection.end(function (err) {
      if (err) throw err;
      console.log('MySQL bağlantısı başarıyla kapatıldı.');
      res.redirect("/detay/" + veri);
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

const path = __dirname + "\\uploads\\";
app.post('/delete', urlencodedParser, function(req, res) {
  if (req.session.derece == 1) {
  let connection = mysql.createConnection(kon);

  veri = req.body.sil;
  let sorgu = 'DELETE FROM stok WHERE id = ' + veri + ';';
  let sorgula = `SELECT * FROM stok WHERE id = ?`;
  let dosyalar = "";

  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sorgula, veri, function (err, results) {
      if (err) throw err.message;
      if (results.length == 1) {
       if (results[0].id == veri) {
        dosyalar = results[0].dosya.split("*");
        for (var i = 1; i < dosyalar.length; i++) {
          try {
           fs.unlinkSync(path + dosyalar[i]);
           console.log("* %s silindi", dosyalar[i]);
          }
          catch (e) {
           console.log(" *Hata %s dosyasını silerken!!", dosyalar[i]);
          }
        }
          connection.query(sorgu, function (err, results) {
            if (err) throw err.message;
            if (results.affectedRows > 0) {
              console.log("Ürün silindi.");
            }

            connection.end(function (err) {
              if (err) throw err;
              console.log('MySQL bağlantısı başarıyla kapatıldı.');
              res.redirect("/stok");
            });
           });
       }
       else {
        connection.end(function (err) {
          if (err) throw err;
          console.log("Ürün kayıtlı değil");
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });
       }
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
})

app.get('/:id', function (req, res) {
  let connection = mysql.createConnection(kon);

  let sorgula = `SELECT * FROM stok WHERE id = ?`;
  let sorgula2 = `SELECT * FROM yorumlar WHERE no = ?`;
  let veri = req.params.id;
  let sqlSorgusu = `SELECT * FROM reklam`;

  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

    connection.query(sorgula, veri, function (err, results) {
      if (err) throw err.message;
      if (results.length == 1) {
       if (results[0].id == veri) {
        urun = results[0];

     yorumlar = [];
     connection.query(sorgula2, veri, function (err, results) {
      if (err) throw err.message;
      if (results.length > 0) {
        for (var i = 0; i < results.length; i++){
          yorumlar.push(results[i]);
        }
      }

      connection.query(sqlSorgusu, function (err, results) {
       if (err) throw err.message;
       if (results.length > 0) {
        reklam = results[results.length-1];

        connection.end(function (err) {
          if (err) throw err;
          console.log('Sayfaya yönlendirildi!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });
        
        if (reklam.dosya == "") {
         console.log("reklam boş.")
         res.render('detay', {
          gid: urun,
          oturum: req.session.isim,
          derece: req.session.derece,
          param: veri,
          yorums: yorumlar,
          app: ap,
          rek: "",
          opp: op
         });
        }
        else {
         console.log("reklam gönderildi.")
         res.render('detay', {
          gid: urun,
          oturum: req.session.isim,
          derece: req.session.derece,
          param: veri,
          yorums: yorumlar,
          app: ap,
          rek: reklam.dosya.split("*")[1],
          opp: op
         });
        }
       }
       else {
        connection.end(function (err) {
          if (err) throw err;
          console.log("reklam yok.")
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });

        res.render('detay', {
          gid: urun,
          oturum: req.session.isim,
          derece: req.session.derece,
          param: veri,
          yorums: yorumlar,
          app: ap,
          rek: "",
          opp: op
        });
       }
      });
     });
       }
       else {
        connection.end(function (err) {
          if (err) throw err;
          console.log('Aranılan sayfa yok!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });
        res.render('404', {
         oturum: req.session.isim,
         derece: req.session.derece,
         app: ap,
         opp: op
        });
       }
      }
      else {
        connection.end(function (err) {
          if (err) throw err;
          console.log('Aranılan sayfa yok!');
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });
        res.render('404', {
          oturum: req.session.isim,
          derece: req.session.derece,
          app: ap,
          opp: op
        });
      }
    });
  });
});

module.exports = app;