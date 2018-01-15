const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
  flow: mongoose.Schema.Types.ObjectId,
  step: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: ['start', 'cancel', 'end'],
  },
  occurred: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['flow', 'step'],
  },
});

const activityModel = mongoose.model('Activity', activitySchema);

module.exports = activityModel;
