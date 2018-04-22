const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: String,
    googleId: String,
    FigmaAccess: String,
    teams: [String],
    currentTeam: String
  }
);

const User = mongoose.model('user', UserSchema);
module.exports = User;
