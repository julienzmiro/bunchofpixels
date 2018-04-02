const router = require('express').Router();
const passport = require('passport');

// router.get('/', (req, res) => {
//   res.render('signIn');
// });

router.get('/sign-out', (req, res) => {
  res.send('Signing out');
});

router.get('/figma', passport.authenticate('figma', {}));

router.get('/figma/redirect', passport.authenticate('figma', { failureRedirect: '/sign-in' }), (req, res) => {
  req.session.at = req.user.accessToken;
  req.session.rt = req.user.refreshToken;
  res.redirect('/app');
});

module.exports = router;
