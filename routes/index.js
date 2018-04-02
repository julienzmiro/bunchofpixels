var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bunch of Pixels' });
});

router.get('/sign-in', function(req, res, next) {
  res.render('signIn');
});

module.exports = router;
