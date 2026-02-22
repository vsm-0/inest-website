const express = require('express');
const { submitReport, getUserReports, getAllReports, updateStatus } = require('../controllers/whistleNestController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

// POST with optional auth (anonymous allowed, but authenticated users get userId)
router.post('/', auth.optional, submitReport);
// User's own reports
router.get('/user', auth, getUserReports);
// Admin: view all reports
router.get('/admin', auth, role(['admin']), getAllReports);
// Admin: update status
router.patch('/:id/status', auth, role(['admin']), updateStatus);

module.exports = router; 