const HomeBaker = require('../models/HomeBaker');

exports.getAllBakers = async (req, res) => {
  try {
    const bakers = await HomeBaker.find();
    res.json(bakers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBaker = async (req, res) => {
  try {
    const { name, menu, delivery, rating, contact } = req.body;
    const baker = await HomeBaker.create({ name, menu, delivery, rating, contact });
    res.status(201).json(baker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBaker = async (req, res) => {
  try {
    const baker = await HomeBaker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!baker) return res.status(404).json({ message: 'Baker not found' });
    res.json(baker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBaker = async (req, res) => {
  try {
    const baker = await HomeBaker.findByIdAndDelete(req.params.id);
    if (!baker) return res.status(404).json({ message: 'Baker not found' });
    res.json({ message: 'Baker deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 