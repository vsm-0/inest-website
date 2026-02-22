const mongoose = require('mongoose');

const medicalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['emergency', 'pharmacy'], required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  hasDelivery: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Medical', medicalSchema); 