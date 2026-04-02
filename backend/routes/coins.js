const express = require('express');
const router = express.Router();
const { getCoins, getCoin, getFeaturedCoins, getRelatedCoins, incrementViews } = require('../controllers/coinController');

router.get('/', getCoins);
router.get('/featured', getFeaturedCoins);
router.get('/:id', getCoin);
router.get('/:id/related', getRelatedCoins);
router.post('/:id/views', incrementViews);

module.exports = router;