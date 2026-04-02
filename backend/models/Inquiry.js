const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  coinId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coin', required: true },
  coinName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, default: '' },  // user's display name
  message: { type: String, required: true },
  // BUG FIX: accept both frontend status values (pending/responded/closed)
  // and admin status values (new/contacted/closed)
  status: {
    type: String,
    enum: ['pending', 'responded', 'closed', 'new', 'contacted'],
    default: 'new'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);