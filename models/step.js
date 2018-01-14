const mongoose = require('mongoose');

const stepSchema = mongoose.Schema({
  title: String,
  flow: mongoose.Schema.Types.ObjectId,
});

const stepModel = mongoose.model('Step', stepSchema);

module.exports = stepModel;
