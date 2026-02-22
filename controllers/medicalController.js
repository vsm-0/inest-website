const Medical = require('../models/Medical');

exports.getAllMedicals = async (req, res) => {
  try {
    const medicals = await Medical.find();
    res.json(medicals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMedical = async (req, res) => {
  try {
    const { name, type, address, contact, hasDelivery } = req.body;
    const medical = await Medical.create({ name, type, address, contact, hasDelivery });
    res.status(201).json(medical);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMedical = async (req, res) => {
  try {
    const medical = await Medical.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!medical) return res.status(404).json({ message: 'Medical not found' });
    res.json(medical);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMedical = async (req, res) => {
  try {
    const medical = await Medical.findByIdAndDelete(req.params.id);
    if (!medical) return res.status(404).json({ message: 'Medical not found' });
    res.json({ message: 'Medical deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 