const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

// const createError = require('http-errors');
const express = require('express');
// const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
// const session = require('cookie-session');
// const mongoose = require('mongoose');

const auth = require('./auth');

const app = express();

const indexRouter = require('./routes/index');
const appRouter = require('./routes/app');
const authRouter = require('./routes/auth');


// const mongoDB = 'mongodb://' + config.database.user + ':' + config.database.pwd + '@' + config.database.host + ':' + config.database.port + '/' + config.database.db;
// mongoose.connect(mongoDB, () => {
//     console.log('connected to mongodb');
// });
// mongoose.Promise = global.Promise;
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(cookieParser());
app.use(session({
  secret: config.session.secret,
  cookie: { maxAge: 24 * 60 * 60 *1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/app', appRouter);
app.use('/auth', authRouter);

// app.use(function(req, res, next) {
//   next(createError(404));
// });

// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
