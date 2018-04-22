const User = require('../models/user');

exports.getUserByID = (userIDToGet, cb) => {
  User.findById(userIDToGet).then((userToReturn) => {
    if (userToReturn) {
      cb(userToReturn);
    } else {
      cb("Can't find user to return");
    }
  });
};

exports.addTeam = (userIDToUpdate, teamIDToAdd, cb) => {
  User.findById(userIDToUpdate).then((userToUpdate) => {
    if (userToUpdate) {
      userToUpdate.teams.push(teamIDToAdd);
      userToUpdate.currentTeam = teamIDToAdd;
      userToUpdate.save().then((updatedUser) => {
        cb();
      });
    } else {
      cb("Can't find user to update");
    }
  });
};

exports.updateCurrentTeam = (userIDToUpdate, teamIDToUse, cb) => {
  User.findById(userIDToUpdate).then((userToUpdate) => {
    if (userToUpdate) {
      userToUpdate.currentTeam = teamIDToUse;
      userToUpdate.save().then((updatedUser) => {
        cb();
      });
    } else {
      cb("Can't find user to update");
    }
  });
};
