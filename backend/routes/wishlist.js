const express = require('express');
const router = express.Router();
const { getWishlist, getWishlistIds, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getWishlist);
router.get('/ids', getWishlistIds);
router.post('/', addToWishlist);
router.delete('/:coinId', removeFromWishlist);
router.delete('/', clearWishlist);

module.exports = router;