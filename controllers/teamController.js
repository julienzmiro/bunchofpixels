const Team = require('../models/team');
const UserController = require('./userController');
const rp = require('request-promise');

validateTeamURL = (urlToValidate) => {
  const regURL = /\b(?:https?:\/\/)?www.?figma.com\/files\/team\/[0-9]+\/.+(\/)?/g;
  return regURL.test(urlToValidate);
};

decodeTeamURL = (urlToDecode) => {
  const teamStart = urlToDecode.search('team/') + 5;
  return {
    urlID: urlToDecode.substring(teamStart, urlToDecode.indexOf('/', teamStart)),
    urlName: urlToDecode.substring(urlToDecode.indexOf('/', teamStart) + 1)
  };
};

exports.getFiles = (teamFigmaID, accessToken, cb) => {
  var filesToReturn = [];
  rp.get('https://api.figma.com/v1/teams/' + teamFigmaID + '/projects', {
    auth: {
      bearer: accessToken
    }
  }).then(resProjects => {
    const projects = JSON.parse(resProjects).projects;
    projects.forEach((project) => {
      rp.get('https://api.figma.com/v1/projects/' + project.id + '/files', {
        auth: {
          bearer: accessToken
        }
      }).then(resFiles => {
        const files = JSON.parse(resFiles).files;
        files.forEach((file) => {
          const fileName = file.name.replace(/\s+/g, '-').toLowerCase();
          filesToReturn.push({
            fileName: fileName,
            fileEmbedURL: 'https://www.figma.com/embed?embed_host=bunchofpixels&url=https://www.figma.com/file/' + file.key + '/' + fileName
          });
        });
        cb(filesToReturn);
      });
    });
  });
};

exports.findByID = (teamIDToFind, cb) => {
  Team.findById(teamIDToFind).then((teamToReturn) => {
    if (teamToReturn) {
      cb(null, teamToReturn);
    } else {
      cb("Error can't find team");
    }
  });
};

exports.updateCurrentTeam = (teamToUse, req, res) => {
  Team.findOne({figmaID: teamToUse}).then((teamFromDB) => {
    if (teamFromDB) {
      UserController.updateCurrentTeam(req.user.id, teamFromDB.id, (err) => {
        if (err) {
          console.error(err);
        } else {
          req.session.team = teamFromDB;
          res.redirect('/app/' + req.session.team.figmaID);
        }
      });
    }
  }).catch((err) => {
    console.error(err);
  });
};

exports.addOrJoin = (req, res) => {
  if (validateTeamURL(req.body.teamurl)) {
    Team.findOne({url: req.body.teamurl}).then((existingTeam) => {
      if (existingTeam) {
        UserController.addTeam(req.user.id, existingTeam.id, (err) => {
          if (err) {
            console.error(err);
          } else {
            req.session.team = existingTeam;
            res.redirect('/app/' + existingTeam.figmaID);
          }
        });
      } else {
        const teamURLDecoded = decodeTeamURL(req.body.teamurl);
        new Team({
          name: teamURLDecoded.urlName,
          figmaID: teamURLDecoded.urlID,
          url: req.body.teamurl,
          users: req.user.id
        }).save().then((newTeam) => {
          UserController.addTeam(req.user.id, newTeam.id, (err) => {
            if (err) {
              res.send('Error: ' + err);
            } else {
              req.session.team = newTeam;
              res.redirect('/app/' + newTeam.figmaID);
            }
          });
        });
      }
    });
  } else {
    res.send('Invalid URL: ' + req.body.teamurl);
  }
};
