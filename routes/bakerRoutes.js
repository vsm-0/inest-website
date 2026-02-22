const express = require('express');
const { getAllBakers, createBaker, updateBaker, deleteBaker } = require('../controllers/bakerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.get('/', getAllBakers);
router.post('/', auth, role(['cook']), createBaker);
router.put('/:id', auth, role(['cook']), updateBaker);
router.delete('/:id', auth, role(['cook']), deleteBaker);

module.exports = router; 