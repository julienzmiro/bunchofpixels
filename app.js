var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var auth = require('./auth');
var indexRouter = require('./routes/index');
var appRouter = require('./routes/app');

var app = express();

// var mongoose = require('mongoose');
// var mongoDB = 'mongodb://' + config.database.user + ':' + config.database.pwd + '@' + config.database.host + ':' + config.database.port + '/' + config.database.db;
// mongoose.connect(mongoDB);
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

auth(passport);
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/app', appRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.get('/auth/figma', passport.authenticate('figma'));
app.get('/auth/figma/callback',
  passport.authenticate('figma', { failureRedirect: '/sign-in' }),
  function(req, res) {
    res.redirect('/app');
  });

module.exports = app;
