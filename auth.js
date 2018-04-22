const env = process.env.NODE_ENV || 'development';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
// TODO: currently loading locally
const FigmaStrategy = require('passport-figma').Strategy;
const config = require('./config')[env];
const User = require('./models/user');
const FigmaAccess = require('./models/figmaAccess');

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret,
    callbackURL: config.googleAuth.callbackURL
  }, (accessToken, refreshToken, profile, done) => {
      User.findOne({googleId: profile.id}).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id
          }).save().then((newUser) => {
            done(null, newUser);
          });
        }
      });
  })
);

passport.use(
  new FigmaStrategy({
    clientID: config.figmaAuth.clientID,
    clientSecret: config.figmaAuth.clientSecret,
    callbackURL: config.figmaAuth.callbackURL,
    state: true,
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    User.findById(req.user.id).then((existingUser) => {
      if (existingUser && !existingUser.FigmaAccess) {
        new FigmaAccess({
          userID: existingUser.id,
          accessToken: accessToken,
          refreshToken: refreshToken
        }).save().then((newFigmaAccess) => {
          existingUser.FigmaAccess = newFigmaAccess.id;
          existingUser.save().then((updatedExistingUser) => {
            done(null, updatedExistingUser);
          });
        });
      } else {
        done(null, existingUser);
      }
    });
  })
);
