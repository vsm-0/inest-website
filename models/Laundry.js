const mongoose = require('mongoose');

const laundrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  price: { type: Number, required: true },
  pickupAvailable: { type: Boolean, default: false },
  timing: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Laundry', laundrySchema); 