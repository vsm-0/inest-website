const mongoose = require('mongoose');

const homeBakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  menu: [{ type: String }],
  delivery: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  contact: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('HomeBaker', homeBakerSchema); 