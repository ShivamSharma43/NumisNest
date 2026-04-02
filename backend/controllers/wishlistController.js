const User = require('../models/User');
const Coin = require('../models/Coin');

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWishlistIds = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.wishlist.map(id => id.toString()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { coinId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (user.wishlist.includes(coinId)) {
      return res.status(400).json({ message: 'Coin already in wishlist' });
    }

    user.wishlist.push(coinId);
    await user.save();
    res.json({ message: 'Added to wishlist', wishlist: user.wishlist.map(id => id.toString()) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.coinId);
    await user.save();
    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist.map(id => id.toString()) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();
    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
