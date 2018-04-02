var express = require('express');
var router = express.Router();

var file_controller = require('../controllers/fileController');
var user_controller = require('../controllers/userController');
var team_controller = require('../controllers/teamController');

router.get('/', function(req, res, next) {
  res.render('app', { title: 'Bunch of Pixels' });
});

module.exports = router;
