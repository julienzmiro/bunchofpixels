const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FigmaAccessSchema = new Schema(
  {
    userID: String,
    accessToken: String,
    refreshToken: String
  }
);

const FigmaAccess = mongoose.model('figmaAccess', FigmaAccessSchema);
module.exports = FigmaAccess;
