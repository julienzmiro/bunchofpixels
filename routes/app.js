const express = require('express');
const router = express.Router();

const TeamController = require('../controllers/teamController');
const UserController = require('../controllers/userController');

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/sign-in');
  } else {
    next();
  }
};

// router.get('/', function(req, res, next) {
//   if (req.session.at && req.session.rt) {
//     rp.get('https://api.figma.com/v1/teams/562343660194795557/projects', {
//       auth: {
//         bearer: req.session.at
//       }
//     }).then(resProjects => {
//       var projects = JSON.parse(resProjects).projects;
//       projects.forEach((item) => {
//         rp.get('https://api.figma.com/v1/projects/' + item.id + '/files', {
//           auth: {
//             bearer: req.session.at
//           }
//         }).then(resFiles => {
//           var files = JSON.parse(resFiles).files;
//           var fileName = files[0].name.replace(/\s+/g, '-').toLowerCase();
//           var embedURL = 'https://www.figma.com/embed?embed_host=bunchofpixels&url=https://www.figma.com/file/' + files[0].key + '/' + fileName;
//           res.render('app', { title: 'Bunch of Pixels', at: req.session.at, rt: req.session.rt, file: embedURL});
//         });
//       });
//     });
//   } else {
//     res.redirect('/sign-in');
//   }
// });

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
    res.render('app', { title: req.session.team.name + ' - Bunch of Pixels' });
  }
});

router.get('/team/add', authCheck, (req, res) => {
  res.render('team-add', { title: 'Bunch of Pixels - Add a team'});
});
router.post('/team/add', authCheck, (req, res) => {
  TeamController.addOrJoin(req, res);
});

module.exports = router;
