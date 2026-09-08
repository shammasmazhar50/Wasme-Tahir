const express = require('express');
const router = express.Router();
const collabController = require('../controllers/collabController');
const auth = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// ─── BRANDS ───
router.get('/brands', cacheMiddleware(300), collabController.getBrands);
router.post('/brands', auth, collabController.createBrand);
router.put('/brands/:id', auth, collabController.updateBrand);
router.delete('/brands/:id', auth, collabController.deleteBrand);

// ─── DEMOGRAPHICS ───
router.get('/demographics', cacheMiddleware(300), collabController.getDemographics);
router.post('/demographics', auth, collabController.createDemographic);
router.put('/demographics/:id', auth, collabController.updateDemographic);
router.delete('/demographics/:id', auth, collabController.deleteDemographic);

// ─── CASE STUDIES ───
router.get('/cases', cacheMiddleware(300), collabController.getCaseStudies);
router.post('/cases', auth, collabController.createCaseStudy);
router.put('/cases/:id', auth, collabController.updateCaseStudy);
router.delete('/cases/:id', auth, collabController.deleteCaseStudy);

module.exports = router;
