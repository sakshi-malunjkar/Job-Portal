const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['recruiter', 'candidate'], required: true },

  // Candidate-specific fields
  skills:   [String],
  resume:   { type: String }, // file path

  // Recruiter links to a Company
  company:  { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
}, { timestamps: true });

userSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);