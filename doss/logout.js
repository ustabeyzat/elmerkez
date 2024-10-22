const express = require('express');
const app = express();
const session = require('express-session');

app.use(express.static('./doss/css'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

app.post('/', function (req, res) {
  if (req.session.isim != null) {
    console.log("\n" + req.session.isim + " çıkış yaptı.");
    req.session.isim = null;
    req.session.derece = null;
    res.redirect('/');
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
  if (req.session.isim != null) {
    console.log("\n" + req.session.isim + " çıkış yaptı.");
    req.session.isim = null;
    req.session.derece = null;
    res.redirect('/');
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