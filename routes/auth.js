const router = require('express').Router();
const passport = require('passport');

router.get('/sign-out', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/sign-in' }), (req, res) => {
  res.redirect('/app');
});

router.get('/figma', passport.authorize('figma', {}));

router.get('/figma/redirect', passport.authorize('figma', { failureRedirect: '/app' }), (req, res) => {
    res.redirect('/app');
  }
);

module.exports = router;
