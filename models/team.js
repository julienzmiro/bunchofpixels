var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TeamSchema = new Schema(
  {
    name: {type: String, required: true},
    users: {type: Schema.ObjectId, ref: 'User', required: true}
  }
);

module.exports = mongoose.model('Team', TeamSchema);
