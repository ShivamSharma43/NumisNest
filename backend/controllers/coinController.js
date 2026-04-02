const Coin = require('../models/Coin');
const mongoose = require('mongoose');

exports.getCoins = async (req, res) => {
  try {
    const { search, era, material, minRarity, maxRarity, sortBy, sortOrder, page = 1, limit = 12 } = req.query;
    
    let query = {};
    
    if (search) query.$text = { $search: search };

    // FIX: filter by denomination OR era (admin stores as denomination, old data uses era)
    if (era) query.$or = [{ era }, { denomination: era }];

    // FIX: lowercase material for comparison
    if (material) query.material = material.toLowerCase();

    // FIX: only show published coins in frontend catalog
    query.$and = query.$and || [];
    query.$and.push({ $or: [{ status: 'published' }, { status: { $exists: false } }] });
    if (minRarity || maxRarity) {
      query.rarity = {};
      if (minRarity) query.rarity.$gte = parseInt(minRarity);
      if (maxRarity) query.rarity.$lte = parseInt(maxRarity);
    }

    let sort = {};
    if (sortBy === 'views') sort.views = sortOrder === 'asc' ? 1 : -1;
    else if (sortBy === 'newest') sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    else if (sortBy === 'rarity') sort.rarity = sortOrder === 'asc' ? 1 : -1;
    else if (sortBy === 'year') sort.year = sortOrder === 'asc' ? 1 : -1;
    else sort.createdAt = -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const coins = await Coin.find(query).sort(sort).skip(skip).limit(parseInt(limit));
    const total = await Coin.countDocuments(query);

    res.json({
      data: coins,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCoin = async (req, res) => {
  try {
    // BUG FIX: Validate ObjectId to prevent CastError crash
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Coin not found' });
    }
    const coin = await Coin.findById(req.params.id);
    if (!coin) return res.status(404).json({ message: 'Coin not found' });
    res.json(coin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedCoins = async (req, res) => {
  try {
    const coins = await Coin.find({ featured: true, $or: [{ status: 'published' }, { status: { $exists: false } }] }).limit(6);
    res.json(coins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRelatedCoins = async (req, res) => {
  try {
    // BUG FIX: Validate ObjectId to prevent CastError crash
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Coin not found' });
    }
    const coin = await Coin.findById(req.params.id);
    if (!coin) return res.status(404).json({ message: 'Coin not found' });
    
    const related = await Coin.find({
      _id: { $ne: coin._id },
      $or: [{ era: coin.era }, { material: coin.material }]
    }).limit(4);
    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.incrementViews = async (req, res) => {
  try {
    await Coin.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ message: 'Views incremented' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
