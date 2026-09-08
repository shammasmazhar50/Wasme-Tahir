const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');
const auth = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/', cacheMiddleware(300), statController.getStats);
router.post('/', auth, statController.createStat);
router.put('/:id', auth, statController.updateStat);
router.delete('/:id', auth, statController.deleteStat);

module.exports = router;
