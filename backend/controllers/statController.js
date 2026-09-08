const Stat = require('../models/Stat');
const { clearCache } = require('../middleware/cacheMiddleware');

exports.getStats = async (req, res) => {
  try {
    const stats = await Stat.findAll({ order: [['order', 'ASC']] });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createStat = async (req, res) => {
  try {
    const stat = await Stat.create(req.body);
    clearCache('/api/stats');
    res.json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteStat = async (req, res) => {
  try {
    const stat = await Stat.findByPk(req.params.id);
    if (!stat) return res.status(404).json({ message: 'Stat not found' });
    await stat.destroy();
    clearCache('/api/stats');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, label, platform, order } = req.body;
    const stat = await Stat.findByPk(id);
    if (!stat) return res.status(404).json({ message: 'Stat not found' });
    
    await stat.update({ value, label, platform, order });
    clearCache('/api/stats');
    res.json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
