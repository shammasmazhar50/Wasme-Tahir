const ContactSubmission = require('../models/ContactSubmission');

exports.submitContact = async (req, res) => {
  try {
    const submission = await ContactSubmission.create(req.body);
    res.status(201).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.findAll({ order: [['createdAt', 'DESC']] });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const submission = await ContactSubmission.findByPk(req.params.id);
    if (submission) {
      submission.isRead = true;
      await submission.save();
      res.json(submission);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await ContactSubmission.findByPk(req.params.id);
    if (submission) {
      await submission.destroy();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
