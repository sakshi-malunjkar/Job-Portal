const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  website:     String,
  location:    String,
  logo:        String,
  recruiter:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);