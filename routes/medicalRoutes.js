const express = require('express');
const { getAllMedicals, createMedical, updateMedical, deleteMedical } = require('../controllers/medicalController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.get('/', getAllMedicals);
router.post('/', auth, role(['admin']), createMedical);
router.put('/:id', auth, role(['admin']), updateMedical);
router.delete('/:id', auth, role(['admin']), deleteMedical);

module.exports = router; 