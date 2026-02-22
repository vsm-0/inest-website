const WhistleNest = require('../models/WhistleNest');

// POST /api/whistlenest (anonymous allowed)
exports.submitReport = async (req, res) => {
  try {
    const { subject, description, type } = req.body;
    let userId = null;
    if (req.user) userId = req.user.id;
    const report = await WhistleNest.create({ subject, description, type, userId });
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/whistlenest/user (user's own reports)
exports.getUserReports = async (req, res) => {
  try {
    const reports = await WhistleNest.find({ userId: req.user.id });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/whistlenest/admin (admin only)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await WhistleNest.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/whistlenest/:id/status (admin only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await WhistleNest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 