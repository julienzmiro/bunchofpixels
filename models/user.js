const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    accessToken: String,
    refreshToken: String
  }
);

module.exports = mongoose.model('User', UserSchema);
