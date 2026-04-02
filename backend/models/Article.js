const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },         // BUG FIX: was required
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },      // BUG FIX: was required
  author: { type: String, default: 'Admin' },     // BUG FIX: was required
  category: { type: String, required: true },
  tags: [String],
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },  // controls featured section
  published: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }, // alias for published
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

articleSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Article', articleSchema);