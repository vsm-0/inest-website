const express = require('express');
const { getAllLaundry, createLaundry, updateLaundry, deleteLaundry } = require('../controllers/laundryController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.get('/', getAllLaundry);
router.post('/', auth, role(['owner']), createLaundry);
router.put('/:id', auth, role(['owner']), updateLaundry);
router.delete('/:id', auth, role(['owner']), deleteLaundry);

module.exports = router; 