var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FileSchema = new Schema(
  {
    name: String,
    url: String
  }
);

module.exports = mongoose.model('File', FileSchema);
