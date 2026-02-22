const Laundry = require('../models/Laundry');

exports.getAllLaundry = async (req, res) => {
  try {
    const laundry = await Laundry.find();
    res.json(laundry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createLaundry = async (req, res) => {
  try {
    const { name, contact, price, pickupAvailable, timing } = req.body;
    const ownerId = req.user.id;
    const laundry = await Laundry.create({ name, contact, price, pickupAvailable, timing, ownerId });
    res.status(201).json(laundry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateLaundry = async (req, res) => {
  try {
    const laundry = await Laundry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!laundry) return res.status(404).json({ message: 'Laundry not found' });
    res.json(laundry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteLaundry = async (req, res) => {
  try {
    const laundry = await Laundry.findByIdAndDelete(req.params.id);
    if (!laundry) return res.status(404).json({ message: 'Laundry not found' });
    res.json({ message: 'Laundry deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 