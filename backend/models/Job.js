const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  location:    String,
  salary:      String,
  skills:      [String],
  companyName: String,
  company:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);