var FigmaStrategy = require('passport-figma').Strategy;
var config = require('./config')[env];

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new FigmaStrategy({
            clientID: config.figmaAuth.clientID,
            clientSecret: config.figmaAuth.clientSecret,
            callbackURL: config.figmaAuth.callbackURL,
            state: true
        },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};
