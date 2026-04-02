const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res) => {
  try {
    const { coinId, coinName, message } = req.body;
    const inquiry = await Inquiry.create({
      coinId,
      coinName,
      userId: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,  // FIX: save user's name
      message
    });
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findOne({ _id: req.params.id, userId: req.user._id });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelInquiry = async (req, res) => {
  try {
    await Inquiry.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Inquiry cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};