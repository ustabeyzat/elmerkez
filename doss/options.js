const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const multer  = require('multer');
const mysql = require('mysql');

app.use(express.static('./doss/css'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function (req, res) {
  if (req.session.derece == 1) {
    res.render('options', {
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
    res.render('options', {
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
    cb(null, __dirname + '/css/logos')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage }).array('log', 1);
app.post('/save', function (req, res) {
  if (req.session.derece == 1) {
    upload(req, res, function(err) {
      if(err){
       console.log(err);
       res.render('hata', {
        oturum: req.session.isim,
        derece: req.session.derece,
        er: "Dosyalar yüklenirken hata! Tekrar denemek için Tıklayın..",
        sayfa: "/options",
        app: ap,
        opp: op
       });
      }

      if (req.files[0] == undefined || req.files[0] == "") {
        dosya = "transparan.png";
      }
      else {
        dosya = "logos/" + req.files[0].originalname;
      }

      let connection = mysql.createConnection(kon);
      let sqlSorgusu = `INSERT INTO opt VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      let veri = [dosya, req.body.isim, req.body.tur, req.body.syr, req.body.ssr, req.body.pyr, req.body.pane, req.body.bod, req.body.titl, req.body.deta, req.body.labe, req.body.ay, req.body.apy, req.body.ap, req.body.buton, req.body.byr];

      connection.connect(function (err) {
       try {
        if (err) throw err;
        console.log("\nMySQL 'e bağlanıldı.")
        connection.query(sqlSorgusu, veri, function (err, results) {
          if (err) {console.log(err)};

          op = {id: 0, log: veri[0], isim: veri[1], tur: veri[2], syr: veri[3], ssr: veri[4], pyr: veri[5], pane: veri[6], bod: veri[7], titl: veri[8], deta: veri[9], labe: veri[10], ay: veri[11], apy: veri[12], ap: veri[13], buton: veri[14], byr: veri[15]};
          console.log('site seçenekleri güncellendi.');

          connection.end(function (err) {
            if (err) throw err;
            console.log('MySQL bağlantısı başarıyla kapatıldı.');
          });
          res.render('bildiri', {
           oturum: req.session.isim,
           derece: req.session.derece,
           er: "Site Seçenekleri Güncellendi.",
           sayfa: "/",
           app: ap,
           opp: op
          });

        });
       }
       catch (error) {
        connection.end(function (err) {
          if (err) throw err;
          console.log('MySQL hatadan dolayı kapatıldı!.');
        });
        res.render('hata', {
         oturum: req.session.isim,
         derece: req.session.derece,
         er: "Site seçenekleri güncellenmedi. Ayarlara gidip tekrar gözden geçirmek için Tıklayın..",
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

app.post('/reset', function (req, res) {
  if (req.session.derece == 1) {
      let connection = mysql.createConnection(kon);
      let sqlSorgusu = `INSERT INTO opt VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      let veri = ['transparan.png', 'SİTE İSMİ', "TÜRÜ", "black", "black", "black", "#e8b923", "#00001d", "#e8b923", "white", "white", "site linki", "black", "lightgrey", "#e8b923", "black"];

      connection.connect(function (err) {
       try {
        if (err) throw err;
        console.log("\nMySQL 'e bağlanıldı.")
        connection.query(sqlSorgusu, veri, function (err, results) {
          if (err) throw err.message;

          op = {id: 0, log: veri[0], isim: veri[1], tur: veri[2], syr: veri[3], ssr: veri[4], pyr: veri[5], pane: veri[6], bod: veri[7], titl: veri[8], deta: veri[9], labe: veri[10], ay: veri[11], apy: veri[12], ap: veri[13], buton: veri[14], byr: veri[15]};
          console.log('site seçenekleri sıfırlandı.');

          connection.end(function (err) {
            if (err) throw err;
            console.log('MySQL bağlantısı başarıyla kapatıldı.');
          });
          res.render('bildiri', {
           oturum: req.session.isim,
           derece: req.session.derece,
           er: "Site Seçenekleri Sıfırlandı.",
           sayfa: "/",
           app: ap,
           opp: op
          });

        });
       }
       catch (error) {
        connection.end(function (err) {
          if (err) throw err;
          console.log('MySQL hatadan dolayı kapatıldı!.');
        });
        res.render('hata', {
         oturum: req.session.isim,
         derece: req.session.derece,
         er: "Site seçenekleri sıfırlanamadı. Ayarlara gidip tekrar gözden geçirmek için Tıklayın..",
         sayfa: "/settings",
         app: ap,
         opp: op
        });
       }
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
