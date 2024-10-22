const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer  = require('multer');

app.use(express.static('./doss/css'));
app.use(express.static('./doss/uploads'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function (req, res) {
  let connection = mysql.createConnection(kon);

  let sorgula = "SELECT * FROM about;";

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

      res.render('about', {
        oturum: req.session.isim,
        derece: req.session.derece,
        abouts: results[results.length-1],
        app: ap,
        opp: op
      });
    });
  });
});

app.post('/options', function (req, res) {
  if (req.session.derece == 1) {
    res.render('optabo', {
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

app.get('/options', function (req, res) {
  if (req.session.derece == 1) {
    res.render('optabo', {
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


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage }).array('image', 21);
app.post('/options/save', urlencodedParser, function (req, res) {
  if (req.session.derece == 1) {
    upload(req, res, function(err) {
      if(err){
       res.render('hata', {
        oturum: req.session.isim,
        derece: req.session.derece,
        er: "Dosyalar yüklenirken hata! Tekrar denemek için Tıklayın..",
        sayfa: "/settings",
        app: ap,
        opp: op
       });
      }

   let connection = mysql.createConnection(kon);

      var dos = "";
      for (var i = 0; i < req.files.length; i++) {
        dos = dos + "*" + req.files[i].originalname
      }

   let sqlSorgusu = `INSERT INTO about VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?);`;
   let veri = [dos, req.body.detay, req.body.hi, req.body.hs, req.body.cti, req.body.cts, req.body.pzi, req.body.pzs];

   connection.connect(function (err) {
      if (err) throw err;
      console.log("\nMySQL 'e bağlanıldı.")

      connection.query(sqlSorgusu, veri, function (err, results) {
        if (err) throw err.message;
        console.log('Hakkında bilgileri kaydedildi.');
      });

      connection.end(function (err) {
        if (err) throw err;
        console.log('MySQL bağlantısı başarıyla kapatıldı.');

        res.redirect('/about');
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

module.exports = app;