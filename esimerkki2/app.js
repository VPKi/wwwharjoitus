var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//tietokannan käyttöönotto
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/testi2');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// näkymämoottorin alustus
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//tietokanta alustetaan käytettäväksi reittifunktioille
app.use(function(req,res,next){
	req.db = db;
	next();
});

app.use('/', routes);
app.use('/users', users);

// virhe 404 ilmoitus
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Virheiden käsittely

// kehitysympäristön ollessa 'dev',
// tulostetaan stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// normaalisti pelkästään virheilmoitus
// 
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
