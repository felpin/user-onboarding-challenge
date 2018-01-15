const mongoose = require('mongoose');

const flowSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const flowModel = mongoose.model('Flow', flowSchema);

module.exports = flowModel;
