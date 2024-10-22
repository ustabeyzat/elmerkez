const express = require('express');
const app = express();
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(express.static('./doss/css'));
app.use(express.static('./doss/uploads'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/anasayfa/options/save', urlencodedParser, function (req, res) {
 if (req.session.derece == 1) {
  let connection = mysql.createConnection(kon);

 if (req.body.slide != null && req.body.alt != null) {
  slide = req.body.slide.toString();
  alt = req.body.alt.toString();
 }
 else if (req.body.slide != null && req.body.alt == null){
  slide = req.body.slide.toString();
  alt = "";
 }
 else if (req.body.slide == null && req.body.alt != null){
  slide = "";
  alt = req.body.alt.toString();
 }
 else {
  slide = "";
  alt = "";
 }

  let sqlSorgusu = `INSERT INTO anapage VALUES(NULL, ?, ?);`;
  let veri = [slide, alt]
  
  connection.connect(function (err) {
    if (err) throw err;
    console.log("\nMySQL 'e bağlanıldı.")

  if (slide.length < 5000 && alt.length < 5000) {

    connection.query(sqlSorgusu, veri, function (err, results) {
      if (err) throw err.message;
      console.log("Anasayfa tablosu yenilendi.");

      connection.end(function (err) {
          if (err) throw err;
          console.log('MySQL bağlantısı başarıyla kapatıldı.');

          res.redirect("/");
      });
    }); 
  }
  else {
   connection.end(function (err) {
    if (err) throw err;
    console.log('Anasayfa boyutu aşıldı!');
    console.log('MySQL bağlantısı başarıyla kapatıldı.');
   });
   res.render('hata', {
    oturum: req.session.isim,
    derece: req.session.derece,
    er: "Anasayfa boyutu aşıldı! Daha az seçmek için Tıklayın..",
    sayfa: "/anasayfa/options",
    app: ap,
    opp: op
   });
  }
  });
 }
});

app.post('/anasayfa/options', function (req, res) {
 if (req.session.derece == 1) {
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

     res.render('optisayfa', {
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

app.get('/anasayfa/options', function (req, res) {
 if (req.session.derece == 1) {
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

     res.render('optisayfa', {
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
 let connection = mysql.createConnection(kon);

 let sqlSorgusu = `SELECT * FROM anapage`;

 connection.connect(function (err) {
  if (err) throw err;
  console.log("\nMySQL 'e bağlanıldı.")

  connection.query(sqlSorgusu, function (err, results) {
    if (err) throw err.message;
    console.log("Anasayfa tablosu alındı.");
    if (results[results.length-1] == undefined) {
     res.render('anasayfa', {
      oturum: req.session.isim,
      derece: req.session.derece,
      slidei: "",
      altu: "",
      slideu: "",
      alti: "",
      altn: "",
      sliden: "",
      app: ap,
      opp: op
     });
    }
    else {
    slide = results[results.length-1].slide.split(",");
    alt = results[results.length-1].alt.split(",");
    slideu = [];
    slidei = [];
    sliden = [];
    altn = [];
    alti = [];
    altu = [];
    for (var i  = 0; i < alt.length; i++){
      alti.push( alt[i].split("|")[1]);
    }
    for (var i  = 0; i < alt.length; i++){
      altu.push( alt[i].split("|")[0]);
    }
    for (var i  = 0; i < alt.length; i++){
      altn.push( alt[i].split("|")[2]);
    }
    for (var i  = 0; i < slide.length; i++){
      slideu.push( slide[i].split("|")[0]);
    }
    for (var i  = 0; i < slide.length; i++){
      slidei.push( slide[i].split("|")[1]);
    }
    for (var i  = 0; i < slide.length; i++){
      sliden.push( slide[i].split("|")[2]);
    }
    if (alt=="") {
      altn = [];
      alti = [];
      altu = [];
    }
    if (slide=="") {
      sliden = [];
      slidei = [];
      slideu = [];
    }
     connection.end(function (err) {
       if (err) throw err;
       console.log('MySQL bağlantısı başarıyla kapatıldı.');
     });

     res.render('anasayfa', {
      oturum: req.session.isim,
      derece: req.session.derece,
      slidei: slidei,
      altu: altu,
      slideu: slideu,
      alti: alti,
      altn: altn,
      sliden: sliden,
      app: ap,
      opp: op
     });
    }
  });
 });
});

app.post('/', function (req, res) {
 let connection = mysql.createConnection(kon);

 let sqlSorgusu = `SELECT * FROM anapage`;

 connection.connect(function (err) {
  if (err) throw err;
  console.log("\nMySQL 'e bağlanıldı.")

  connection.query(sqlSorgusu, function (err, results) {
    if (err) throw err.message;
    console.log("Anasayfa tablosu alındı.");
    if (results[results.length-1] == undefined) {
     res.render('anasayfa', {
      oturum: req.session.isim,
      derece: req.session.derece,
      slidei: "",
      altu: "",
      slideu: "",
      alti: "",
      altn: "",
      sliden: "",
      app: ap,
      opp: op
     });
    }
    else {
    slide = results[results.length-1].slide.split(",");
    alt = results[results.length-1].alt.split(",");
    slideu = [];
    slidei = [];
    sliden = [];
    altn = [];
    alti = [];
    altu = [];
    for (var i  = 0; i < alt.length; i++){
      alti.push( alt[i].split("|")[1]);
    }
    for (var i  = 0; i < alt.length; i++){
      altu.push( alt[i].split("|")[0]);
    }
    for (var i  = 0; i < alt.length; i++){
      altn.push( alt[i].split("|")[2]);
    }
    for (var i  = 0; i < slide.length; i++){
      slideu.push( slide[i].split("|")[0]);
    }
    for (var i  = 0; i < slide.length; i++){
      slidei.push( slide[i].split("|")[1]);
    }
    for (var i  = 0; i < slide.length; i++){
      sliden.push( slide[i].split("|")[2]);
    }

     connection.end(function (err) {
       if (err) throw err;
       console.log('MySQL bağlantısı başarıyla kapatıldı.');
     });

     res.render('anasayfa', {
      oturum: req.session.isim,
      derece: req.session.derece,
      slidei: slidei,
      altu: altu,
      slideu: slideu,
      alti: alti,
      altn: altn,
      sliden: sliden,
      app: ap,
      opp: op
     });
   }
  });
 });
});

module.exports = app;