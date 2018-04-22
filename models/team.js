var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TeamSchema = new Schema(
  {
    name: String,
    figmaID: String,
    url: String,
    users: [String]
  }
);

module.exports = mongoose.model('Team', TeamSchema);
