const express = require('express');
const app = express();
const session = require('express-session');
const multer  = require('multer');
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(express.static('./doss/css'));
app.use(express.static('./doss/uploads'));

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

app.get('/', function (req, res) {
 let connection = mysql.createConnection(kon);

 let sqlSorgusu = `SELECT * FROM reklam`;

 connection.connect(function (err) {
  if (err) throw err;
  console.log("\nMySQL 'e bağlanıldı.")

  connection.query(sqlSorgusu, function (err, results) {
    if (err) throw err.message;
    if (results.length > 0) {
       console.log("Tüm reklamlar okundu.")
       connection.end(function (err) {
         if (err) throw err;
         console.log('MySQL bağlantısı başarıyla kapatıldı.');
       });

       res.render('reklam', {
          gid: results[results.length-1],
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
 });
});

app.post('/', function (req, res) {
 let connection = mysql.createConnection(kon);

 let sqlSorgusu = `SELECT * FROM reklam`;

 connection.connect(function (err) {
  if (err) throw err;
  console.log("\nMySQL 'e bağlanıldı.")

  connection.query(sqlSorgusu, function (err, results) {
    if (err) throw err.message;
    if (results.length > 0) {
       console.log("Tüm reklamlar okundu.")
       connection.end(function (err) {
         if (err) throw err;
         console.log('MySQL bağlantısı başarıyla kapatıldı.');
       });

       res.render('reklam', {
          gid: results[results.length-1],
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
 });
});

app.get('/set', function (req, res) {
  if (req.session.derece == 1) {
    res.render('set', {
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

app.post('/set', function (req, res) {
  if (req.session.derece == 1) {
    res.render('set', {
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
app.post('/create', function (req, res) {
  if (req.session.derece == 1) {
    upload(req, res, function(err) {
      if(err){
       res.render('hata', {
        oturum: req.session.isim,
        derece: req.session.derece,
        er: "Dosyalar yüklenirken hata! Tekrar denemek için Tıklayın..",
        sayfa: "/add",
        app: ap,
        opp: op
       });
      }

      let connection = mysql.createConnection(kon);

      var dos = "";
      for (var i = 0; i < req.files.length; i++) {
        dos = dos + "*" + req.files[i].originalname
      }
      
      let sqlSorgusu = `INSERT INTO reklam VALUES(NULL, ?, ?, ?, ?, ?);`;
      let veri = [dos, req.body.title, req.body.ozet, req.body.area, req.body.tarih]

      connection.connect(function (err) {
       try {
        if (err) throw err;
        console.log("\nMySQL 'e bağlanıldı.")

        connection.query(sqlSorgusu, veri, function (err, results) {
          if (err) throw err.message;
          console.log('Reklam eklendi.');

        connection.end(function (err) {
          if (err) throw err;
          console.log('MySQL bağlantısı başarıyla kapatıldı.');
        });
          res.redirect("/reklam");
        });
       }
       catch (error) {
        connection.end(function (err) {
          if (err) throw err;
          console.log('MySQL hatadan dolayı kapatıldı.');
        });
       res.render('hata', {
        oturum: req.session.isim,
        derece: req.session.derece,
        er: "Reklam kaydedilemedi. Ayarlara gidip tekrar gözden geçirmek için Tıklayın..",
        sayfa: "/settings",
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