const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  // BUG FIX: era/denomination — accept both field names, store as era
  era: { type: String, default: 'other' },
  denomination: { type: String, default: '' }, // admin form uses this
  ruler: { type: String, default: '' },
  leader: { type: String, default: '' },       // admin form uses this
  dynasty: { type: String, default: '' },
  material: {
    type: String,
    // BUG FIX: relax enum — admin sends 'Gold','Silver' etc (capitalized)
    required: true,
    lowercase: true,  // auto-lowercase so 'Gold' → 'gold'
  },
  weight: Number,
  diameter: Number,
  rarity: { type: Number, min: 1, max: 5, required: true },
  description: { type: String, default: '' },   // BUG FIX: was required, now optional with default
  historicalContext: { type: String, default: '' },
  mintLocation: { type: String, default: '' },
  mint: { type: String, default: '' },          // admin form uses this
  images: [String],
  imageUrl: { type: String, default: '' },      // admin form uses this
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

coinSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Coin', coinSchema);