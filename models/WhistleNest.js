const mongoose = require('mongoose');

const whistleNestSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['abuse', 'service issue', 'suggestion'], required: true },
  status: { type: String, enum: ['pending', 'under_review', 'resolved'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('WhistleNest', whistleNestSchema); 