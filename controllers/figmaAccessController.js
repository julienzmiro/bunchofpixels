const FigmaAccess = require('../models/figmaAccess');

exports.getFigmaAccessByUserID = (userIDToGet, cb) => {
  FigmaAccess.findOne({userID: userIDToGet}).then((figmaAccessToReturn) => {
    if (figmaAccessToReturn) {
      cb(figmaAccessToReturn);
    } else {
      cb("Can't find Figma Access to return");
    }
  });
};
