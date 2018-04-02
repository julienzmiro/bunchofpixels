var express = require('express');
var router = express.Router();

var file_controller = require('../controllers/fileController');
var user_controller = require('../controllers/userController');
var team_controller = require('../controllers/teamController');

router.get('/', function(req, res, next) {
  if (req.session.at && req.session.rt) {
    res.render('app', { title: 'Bunch of Pixels', at: req.session.at, rt: req.session.rt});
  } else {
    res.redirect('/sign-in');
  }
});

module.exports = router;
