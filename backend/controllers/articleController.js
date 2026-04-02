const Article = require('../models/Article');
const mongoose = require('mongoose');

exports.getArticles = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 100 } = req.query;
    
    // Show articles that are published (check both boolean and status string)
    const publishedFilter = { $or: [{ published: true }, { status: 'published' }] };
    let query = { ...publishedFilter };
    if (category) query.category = category;
    // Use regex for search instead of $text to avoid index conflicts
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const articles = await Article.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Article.countDocuments(query);

    res.json({
      data: articles,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArticle = async (req, res) => {
  try {
    // BUG FIX: Validate ObjectId to prevent CastError crash
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Article not found' });
    }
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedArticles = async (req, res) => {
  try {
    const articles = await Article.find({ $or: [{ published: true }, { status: 'published' }] }).sort({ featured: -1, views: -1, createdAt: -1 }).limit(3);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Article.distinct('category');
    res.json(categories.map((name, i) => ({ id: String(i + 1), name, count: 0 })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.incrementViews = async (req, res) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ message: 'Views incremented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
