const express = require('express');
const router = express.Router();

const TeamController = require('../controllers/teamController');
const UserController = require('../controllers/userController');
const FigmaAccessController = require('../controllers/figmaAccessController');

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/sign-in');
  } else {
    next();
  }
};

router.get('/', authCheck, (req, res) => {
  if (req.user.currentTeam) {
    TeamController.findByID(req.user.currentTeam, (err, team) => {
      if (err) {
        console.error(err);
      } else {
        res.redirect('/app/' + team.figmaID);
      }
    });
  } else {
    res.render('app', { title: 'Bunch of Pixels' });
  }
});

router.get('/:teamID', authCheck, (req, res) => {
  if (req.session.team.figmaID != req.params.teamID) {
    TeamController.updateCurrentTeam(req.params.teamID, req, res);
  } else {
    FigmaAccessController.getFigmaAccessByUserID(req.user.id, (figmaAccessToPass) => {
      TeamController.getFiles(req.session.team.figmaID, figmaAccessToPass.accessToken, (filesToRender) => {
        filesToRender.forEach((file) => {
          console.log(file);
        });
        res.render('app', { title: req.session.team.name + ' - Bunch of Pixels', files: filesToRender });
      });
    });
  }
});

router.get('/team/add', authCheck, (req, res) => {
  res.render('team-add', { title: 'Bunch of Pixels - Add a team'});
});
router.post('/team/add', authCheck, (req, res) => {
  TeamController.addOrJoin(req, res);
});

module.exports = router;
