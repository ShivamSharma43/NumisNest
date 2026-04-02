const User = require('../models/User');
const Coin = require('../models/Coin');
const Inquiry = require('../models/Inquiry');
const Article = require('../models/Article');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

// ── Dashboard ────────────────────────────────────────────────────────────────

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalCoins, totalUsers, totalInquiries] = await Promise.all([
      Coin.countDocuments(),
      User.countDocuments(),
      Inquiry.countDocuments(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newInquiriesToday = await Inquiry.countDocuments({ createdAt: { $gte: today } });

    res.json({ data: { totalCoins, totalUsers, totalInquiries, newInquiriesToday }, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMostViewedCoins = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const coins = await Coin.find().sort({ views: -1 }).limit(limit).select('name views');
    res.json({ data: coins.map(c => ({ name: c.name, views: c.views })), success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEraPopularity = async (req, res) => {
  try {
    const result = await Coin.aggregate([
      { $group: { _id: '$era', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } },
    ]);
    res.json({ data: result, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInquiryTrends = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const result = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]);
    res.json({ data: result, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [
      totalCoinViews,
      totalArticleViews,
      avgRarityResult,
      totalInquiries,
      materialDist,
      rarityBreakdown,
      topViewedCoins,
      inquiryByStatus,
    ] = await Promise.all([
      // Total coin views
      Coin.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      // Total article views
      Article.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      // Average rarity
      Coin.aggregate([{ $group: { _id: null, avg: { $avg: '$rarity' } } }]),
      // Total inquiries
      Inquiry.countDocuments(),
      // Material distribution
      Coin.aggregate([
        { $group: { _id: '$material', value: { $sum: 1 } } },
        { $project: { name: '$_id', value: 1, _id: 0 } },
        { $sort: { value: -1 } },
      ]),
      // Rarity breakdown (1-5 stars)
      Coin.aggregate([
        { $group: { _id: '$rarity', value: { $sum: 1 } } },
        { $project: { name: { $concat: [{ $toString: '$_id' }, ' ★'] }, value: 1, _id: 0 } },
        { $sort: { name: 1 } },
      ]),
      // Top 5 most viewed coins
      Coin.find().sort({ views: -1 }).limit(5).select('name views'),
      // Inquiries by status
      Inquiry.aggregate([
        { $group: { _id: '$status', value: { $sum: 1 } } },
        { $project: { name: '$_id', value: 1, _id: 0 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalCoinViews: totalCoinViews[0]?.total || 0,
        totalArticleViews: totalArticleViews[0]?.total || 0,
        avgRarity: avgRarityResult[0]?.avg || 0,
        totalInquiries,
        materialDistribution: materialDist,
        rarityBreakdown,
        topViewedCoins: topViewedCoins.map(c => ({ name: c.name, views: c.views })),
        inquiryByStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllCoins = async (req, res) => {
  try {
    const { search, status, material, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (status && status !== 'all') query.status = status;
    if (material && material !== 'all') query.material = material.toLowerCase();
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [coins, total] = await Promise.all([
      Coin.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Coin.countDocuments(query),
    ]);
    res.json({ data: coins, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Coin Admin CRUD ──────────────────────────────────────────────────────────

exports.createCoin = async (req, res) => {
  try {
    const coin = await Coin.create(req.body);
    res.status(201).json({ data: coin, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCoin = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: 'Coin not found' });

    const coinUpdates = { ...req.body, updatedAt: new Date() };
    // BUG FIX: lowercase material if provided
    if (coinUpdates.material) coinUpdates.material = coinUpdates.material.toLowerCase();

    const coin = await Coin.findByIdAndUpdate(
      req.params.id,
      coinUpdates,
      { new: true, runValidators: true }
    );
    if (!coin) return res.status(404).json({ message: 'Coin not found' });
    res.json({ data: coin, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCoin = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: 'Coin not found' });

    const coin = await Coin.findByIdAndDelete(req.params.id);
    if (!coin) return res.status(404).json({ message: 'Coin not found' });

    // Remove from all users' wishlists
    await User.updateMany({ wishlist: req.params.id }, { $pull: { wishlist: req.params.id } });
    res.json({ success: true, message: 'Coin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleCoinFeatured = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: 'Coin not found' });

    const coin = await Coin.findById(req.params.id);
    if (!coin) return res.status(404).json({ message: 'Coin not found' });

    coin.featured = !coin.featured;
    await coin.save();
    res.json({ data: coin, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadCoinImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'numisnest/coins' });
    res.json({ url: result.secure_url, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllArticles = async (req, res) => {
  try {
    const { search, status, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (status && status !== 'all') {
      if (status === 'published') query.$or = [{ published: true }, { status: 'published' }];
      else query.$or = [{ published: false, status: { $ne: 'published' } }, { status: 'draft' }];
    }
    if (category && category !== 'all') query.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [articles, total] = await Promise.all([
      Article.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Article.countDocuments(query),
    ]);
    res.json({ data: articles, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Article Admin CRUD ───────────────────────────────────────────────────────

exports.createArticle = async (req, res) => {
  try {
    const { title, category, content, tags, status, published, excerpt, author, coverImage } = req.body;

    // BUG FIX: admin form sends 'status' as 'draft'|'published', model uses 'published' boolean
    const isPublished = published !== undefined ? published : status === 'published';

    // Auto-generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      + '-' + Date.now();

    const article = await Article.create({
      title,
      slug,
      excerpt: excerpt || title.substring(0, 120),
      content,
      coverImage: coverImage || '',
      author: author || 'Admin',
      category,
      tags: tags || [],
      published: isPublished,
      status: isPublished ? 'published' : 'draft',
    });
    res.status(201).json({ data: article, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: 'Article not found' });

    const updates = { ...req.body, updatedAt: new Date() };
    // BUG FIX: keep published boolean and status string in sync
    if (updates.status === 'published') updates.published = true;
    if (updates.status === 'draft') updates.published = false;
    if (updates.published === true) updates.status = 'published';
    if (updates.published === false) updates.status = 'draft';

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ data: article, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: 'Article not found' });

    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleArticlePublished = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: 'Article not found' });

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    article.published = !article.published;
    article.updatedAt = new Date();
    await article.save();
    res.json({ data: article, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.toggleArticleFeatured = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: 'Article not found' });

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    article.featured = !article.featured;
    article.updatedAt = new Date();
    await article.save();
    res.json({ data: article, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Inquiry Admin ────────────────────────────────────────────────────────────

exports.getAllInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Inquiry.countDocuments(query),
    ]);
    res.json({
      data: inquiries, total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInquiryStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: 'Inquiry not found' });

    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ data: inquiry, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteInquiry = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ message: 'Inquiry not found' });
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendInquiryReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: 'Inquiry not found' });

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    // Send email via nodemailer
    const { sendOTP } = require('../config/mailer');
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: (process.env.MAIL_PASS || '').replace(/\s/g, ''),
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"NumisNest" <${process.env.MAIL_USER}>`,
      to: inquiry.userEmail,
      subject: subject || `Re: Inquiry about ${inquiry.coinName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#92400e;">NumisNest — Response to Your Inquiry</h2>
          <p style="color:#374151;white-space:pre-wrap;">${message}</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="color:#9ca3af;font-size:12px;">Your original inquiry about <strong>${inquiry.coinName}</strong>:<br/>${inquiry.message}</p>
          <p style="color:#9ca3af;font-size:12px;">— NumisNest Team | official.numisnest@gmail.com</p>
        </div>
      `,
    });

    // Auto-update status to 'contacted'
    inquiry.status = 'contacted';
    await inquiry.save();

    res.json({ success: true, message: 'Reply sent and status updated to contacted' });
  } catch (error) {
    console.error('sendInquiryReply error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── Users Admin ──────────────────────────────────────────────────────────────

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(),
    ]);
    res.json({ data: users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
