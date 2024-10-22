const express = require('express');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
const nodemailer = require('nodemailer');

kon = {
  host: 'localhost',
  database: 'site_db',
  user: 'root',
  password: 'parola'
}

tran = {
  service: 'gmail',
  auth: {
    user: 'imajreklamajans.com@gmail.com',
    pass: '018108-aeA'
  }
}

let connection = mysql.createConnection(kon);

let sqlSorgusu = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT NOT NULL,
  nick VARCHAR(20) NOT NULL,
  eposta VARCHAR(35) NOT NULL,
  parola VARCHAR(25) NOT NULL,
  seviye VARCHAR(2) NOT NULL,
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu2 = `CREATE TABLE IF NOT EXISTS stok (
  id INT AUTO_INCREMENT NOT NULL,
  dosya VARCHAR(5000),
  title VARCHAR(1000) NOT NULL,
  ozet VARCHAR(2000),
  detay VARCHAR(5000),
  etiket VARCHAR(2000),
  tarih VARCHAR(25),
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu3 = `CREATE TABLE IF NOT EXISTS contact (
  id INT AUTO_INCREMENT NOT NULL,
  gsm VARCHAR(25),
  posta VARCHAR(100),
  face VARCHAR(100),
  twit VARCHAR(100),
  ins VARCHAR(100),
  letgo VARCHAR(100),
  linked VARCHAR(100),
  youtube VARCHAR(100),
  twitch VARCHAR(100),
  adres VARCHAR(1000),
  harita VARCHAR(2000),
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu4 = `CREATE TABLE IF NOT EXISTS about (
  id INT AUTO_INCREMENT NOT NULL,
  dosya VARCHAR(5000),
  detay VARCHAR(3000),
  hi VARCHAR(20),
  hs VARCHAR(20),
  cti VARCHAR(20),
  cts VARCHAR(20),
  pzi VARCHAR(20),
  pzs VARCHAR(20),
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu5 = `CREATE TABLE IF NOT EXISTS anapage (
  id INT AUTO_INCREMENT NOT NULL,
  slide VARCHAR(5000),
  alt VARCHAR(5000),
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu6 = `CREATE TABLE IF NOT EXISTS yorumlar (
  id INT AUTO_INCREMENT NOT NULL,
  no VARCHAR(10),
  nick VARCHAR(20),
  yorum VARCHAR(100),
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu7 = `CREATE TABLE IF NOT EXISTS onaylar (
  id INT AUTO_INCREMENT NOT NULL,
  eposta VARCHAR(35),
  kod VARCHAR(11),
  deneme VARCHAR(3),
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu10 = `CREATE TABLE IF NOT EXISTS reklam (
  id INT AUTO_INCREMENT NOT NULL,
  dosya VARCHAR(5000),
  title VARCHAR(1000) NOT NULL,
  ozet VARCHAR(2000),
  detay VARCHAR(5000),
  tarih VARCHAR(25),
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu11 = `CREATE TABLE IF NOT EXISTS app (
  id INT AUTO_INCREMENT NOT NULL,
  ad VARCHAR(15) NOT NULL,
  adlar VARCHAR(18),
  kategoriler VARCHAR(300),
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu13 = `CREATE TABLE IF NOT EXISTS opt (
  id INT AUTO_INCREMENT NOT NULL,
  log VARCHAR(50) NOT NULL,
  isim VARCHAR(20) NOT NULL,
  tur VARCHAR(20) NOT NULL,
  syr VARCHAR(20) NOT NULL,
  ssr VARCHAR(20) NOT NULL,
  pyr VARCHAR(20) NOT NULL,
  pane VARCHAR(20) NOT NULL,
  bod VARCHAR(20) NOT NULL,
  titl VARCHAR(20) NOT NULL,
  deta VARCHAR(20) NOT NULL,
  labe VARCHAR(20) NOT NULL,
  ay VARCHAR(30) NOT NULL,
  apy VARCHAR(20) NOT NULL,
  ap VARCHAR(20) NOT NULL,
  buton VARCHAR(20) NOT NULL,
  byr VARCHAR(20) NOT NULL,
  CONSTRAINT PK_sira PRIMARY KEY(id)
);`;

let sqlSorgusu12 = `SELECT * FROM app`;
let sqlSorgusu14 = `SELECT * FROM opt`;

connection.connect(function (err) {
  if (err) throw err;
  console.log("\nMySQL 'e bağlanıldı.")

  connection.query(sqlSorgusu, function (err, results) {
    if (err) throw err.message;
    console.log('users tablosu hazır.');
  });

  connection.query(sqlSorgusu2, function (err, results) {
    if (err) throw err.message;
    console.log('stok tablosu hazır.');
  });

  connection.query(sqlSorgusu3, function (err, results) {
    if (err) throw err.message;
    console.log('contact tablosu hazır.');
  });

  connection.query(sqlSorgusu4, function (err, results) {
    if (err) throw err.message;
    console.log('about tablosu hazır.');
  });

  connection.query(sqlSorgusu5, function (err, results) {
    if (err) throw err.message;
    console.log('anasayfa tablosu hazır.');
  });

  connection.query(sqlSorgusu6, function (err, results) {
    if (err) throw err.message;
    console.log('yorumlar tablosu hazır.');
  });

  connection.query(sqlSorgusu7, function (err, results) {
    if (err) throw err.message;
    console.log('onaylar tablosu hazır.');
  });

  connection.query(sqlSorgusu10, function (err, results) {
    if (err) throw err.message;
    console.log('reklam tablosu hazır.');
  });

  connection.query(sqlSorgusu11, function (err, results) {
    if (err) throw err.message;
    console.log('app tablosu hazır.');
  });

  connection.query(sqlSorgusu13, function (err, results) {
    if (err) throw err.message;
    console.log('opt tablosu hazır.');
  });

  connection.query(sqlSorgusu12, function (err, results) {
    if (err) throw err.message;
    if (results.length > 0) {
      ap = results[results.length-1];
    }
    else {
      ap = {id: 0, ad: 'App', adlar: 'App', kategoriler: ""}
    }
  });

  connection.query(sqlSorgusu14, function (err, results) {
    if (err) throw err.message;
    if (results.length > 0) {
      op = results[results.length-1];
    }
    else {
      op = {id: 0, log: 'transparan.png', isim: 'İSİM', tur: "SLOGAN", syr: "#8B0000", ssr: "#8B0000", pyr: "black", pane: "white", bod: "white", titl: "#8B0000", deta: "black", labe: "black", ay: "usta", apy: "black", ap: "#A9A9A9", buton: "#e8b923", byr: "black"}
    }
  });
  
  let sqlSorgusu8 = `SELECT * FROM users`;
  let sqlSorgusu9 = `INSERT INTO users VALUES(NULL, ?, ?, ?, ?);`;
  let transporter = nodemailer.createTransport(tran);

  connection.query(sqlSorgusu8, function (err, results) {
      if (err) {
        console.log(err)

        connection.end(function (err) {
          if (err) throw err;
          console.log('MySQL bağlantısı başarıyla kapatıldı.\n');
        });
      };
      if (results.length == 0) {
        veri = ["usta", "ustabeyzat@gmail.com", "parola", '1'];

        connection.query(sqlSorgusu9, veri, function (err, results) {
          if (err) {console.log(err)}
          else {
            console.log(' * Root hesabı oluşturuldu.');
        transporter.verify(function (error, success) {
          if (error) {
            console.log('Site e-posta adresine bağlanamadı!');
          }
          else {
            console.log('Site e-posta adresine bağlandı.');
          }
        });

        let bilgiler = {
          to: veri[1],
          subject: 'Root Hesabı',
          text: "Nick ve Parola: usta/" + "parola"
        };

        transporter.sendMail(bilgiler, function (error, info) {
          if (error) {
              console.log('*E-posta gönderilemedi!.');
              console.log(veri[0]);

              connection.end(function (err) {
                if (err) throw err;
                console.log('MySQL bağlantısı başarıyla kapatıldı.\n');
              });
          }
          else {
              console.log('*E-posta gönderildi.');
              connection.end(function (err) {
                if (err) throw err;
                console.log('MySQL bağlantısı başarıyla kapatıldı.\n');
              });
          }
        });
          }
        });
      }
      else {
          console.log(' * Kayıtlı üye var.');
          connection.end(function (err) {
            if (err) throw err;
            console.log('MySQL bağlantısı başarıyla kapatıldı.\n');
          });
      }
  });
});

app.use(express.static('./doss/css'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/doss/html');

app.use(session({
  secret: 'key-anahtar617',
  resave: false,
  saveUninitialized: true
}));

app.use('/', require('./doss/anasayfa'));
app.use('/anasayfa', require('./doss/anasayfa'));
app.use('/about', require('./doss/about'));
app.use('/contact', require('./doss/contact'));
app.use('/stok', require('./doss/stok'));
app.use('/login', require('./doss/login'));
app.use('/hesap', require('./doss/hesap'));
app.use('/detay', require('./doss/detay'));
app.use('/reklam', require('./doss/reklam'));
app.use('/add', require('./doss/add'));
app.use('/settings', require('./doss/settings'));
app.use('/options', require('./doss/options'));
app.use('/logout', require('./doss/logout'));
app.use('/app', require('./doss/app'));

app.use(function(req, res){
    res.render('404', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
});

app.listen(8080, function () {
  console.log('Sunucu çalışıyor..');
});