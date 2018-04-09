const env = process.env.NODE_ENV || 'development';

const config = require('./config')[env];
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const auth = require('./auth');
const indexRouter = require('./routes/index');
const appRouter = require('./routes/app');
const authRouter = require('./routes/auth');

const app = express();

const mongoDB = 'mongodb://' + config.database.user + ':' + config.database.pwd + '@' + config.database.host + ':' + config.database.port + '/' + config.database.db;
mongoose.connect(mongoDB, () => {
    console.log('connected to mongodb');
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 *1000,
  keys: [config.session.cookieSecret]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/app', appRouter);
app.use('/auth', authRouter);

module.exports = app;
