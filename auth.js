const env = process.env.NODE_ENV || 'development';
const passport = require('passport');
const FigmaStrategy = require('passport-figma').Strategy;
const config = require('./config')[env];
const uniqid = require('uniqid');

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(
  new FigmaStrategy({
    clientID: config.figmaAuth.clientID,
    clientSecret: config.figmaAuth.clientSecret,
    callbackURL: config.figmaAuth.callbackURL,
    state: true
  }, (accessToken, refreshToken, profile, done) => {
    done(null, {
      "id": uniqid(),
      "accessToken": accessToken,
      "refreshToken": refreshToken
    });
  })
);
