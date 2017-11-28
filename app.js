var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/data-api/router-api');
var data = require('./routes/data/router-data');
var app_logger = require('./routes/common/logger');
var excel = require('./routes/export/excel-file');
var db = require('./model/db.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "process.env.SESSION_SECRET",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/home/',
    failureRedirect: '/'
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use('/', index);
app.use('/', users);
app.use('/', api);
app.use('/', data);
app.use('/', app_logger);
app.use('/', excel);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('user-flow/error-message', { error: err });
});

module.exports = app;
