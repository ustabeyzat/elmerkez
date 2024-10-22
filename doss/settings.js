const express = require('express');
const app = express();
const session = require('express-session');

app.use(express.static('./doss/css'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/html');

app.get('/', function (req, res) {
 if (req.session.isim != null ) {
   if (req.session.derece == 1) {
    res.render('settings', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
   }
   else {
   	res.render('settings2', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
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

app.post('/', function (req, res) {
 if (req.session.isim != null ) {
   if (req.session.derece == 1) {
    res.render('settings', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
    });
   }
   else {
    res.render('settings2', {
      oturum: req.session.isim,
      derece: req.session.derece,
      app: ap,
      opp: op
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
