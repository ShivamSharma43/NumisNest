const express = require('express');
const router = express.Router();
const { getArticles, getArticle, getFeaturedArticles, getCategories, incrementViews } = require('../controllers/articleController');

router.get('/', getArticles);
router.get('/featured', getFeaturedArticles);
router.get('/categories', getCategories);
router.get('/:id', getArticle);
router.post('/:id/views', incrementViews);

module.exports = router;
