const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, enum: ['application_status', 'new_applicant', 'message'], required: true },
  title:       { type: String, required: true },
  message:     { type: String, required: true },
  read:        { type: Boolean, default: false },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  job:         { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  interviewDetails: {
    date:     String,
    time:     String,
    location: String,
    notes:    String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);