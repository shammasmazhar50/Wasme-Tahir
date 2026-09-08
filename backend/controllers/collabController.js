const Brand = require('../models/Brand');
const CaseStudy = require('../models/CaseStudy');
const Demographic = require('../models/Demographic');
const { clearCache } = require('../middleware/cacheMiddleware');

// Brands
exports.getBrands = async (req, res) => res.json(await Brand.findAll({ order: [['order', 'ASC']] }));
exports.createBrand = async (req, res) => {
  const brand = await Brand.create(req.body);
  clearCache('/api/collab');
  res.json(brand);
};
exports.updateBrand = async (req, res) => {
  const brand = await Brand.findByPk(req.params.id);
  if(brand) {
    await brand.update(req.body);
    clearCache('/api/collab');
    res.json(brand);
  }
};
exports.deleteBrand = async (req, res) => {
  const brand = await Brand.findByPk(req.params.id);
  if(brand) {
    await brand.destroy();
    clearCache('/api/collab');
  }
  res.json({ success: true });
};

// Case Studies
exports.getCaseStudies = async (req, res) => res.json(await CaseStudy.findAll({ order: [['order', 'ASC']] }));
exports.createCaseStudy = async (req, res) => {
  const cs = await CaseStudy.create(req.body);
  clearCache('/api/collab');
  res.json(cs);
};
exports.updateCaseStudy = async (req, res) => {
  const cs = await CaseStudy.findByPk(req.params.id);
  if(cs) {
    await cs.update(req.body);
    clearCache('/api/collab');
    res.json(cs);
  }
};
exports.deleteCaseStudy = async (req, res) => {
  const cs = await CaseStudy.findByPk(req.params.id);
  if(cs) {
    await cs.destroy();
    clearCache('/api/collab');
  }
  res.json({ success: true });
};

// Demographics
exports.getDemographics = async (req, res) => res.json(await Demographic.findAll({ order: [['order', 'ASC']] }));
exports.createDemographic = async (req, res) => {
  const d = await Demographic.create(req.body);
  clearCache('/api/collab');
  res.json(d);
};
exports.updateDemographic = async (req, res) => {
  const d = await Demographic.findByPk(req.params.id);
  if(d) {
    await d.update(req.body);
    clearCache('/api/collab');
    res.json(d);
  }
};
exports.deleteDemographic = async (req, res) => {
  const d = await Demographic.findByPk(req.params.id);
  if(d) {
    await d.destroy();
    clearCache('/api/collab');
  }
  res.json({ success: true });
};
