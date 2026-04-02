const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminAuth');
const { upload } = require('../middleware/multer');
const {
  getDashboardStats, getMostViewedCoins, getEraPopularity, getInquiryTrends, getAnalytics,
  getAllCoins, createCoin, updateCoin, deleteCoin, toggleCoinFeatured, uploadCoinImage,
  createArticle, updateArticle, deleteArticle, toggleArticlePublished, toggleArticleFeatured,
  getAllArticles, getAllInquiries, updateInquiryStatus, deleteInquiry, sendInquiryReply,
  getAllUsers,
} = require('../controllers/adminController');

// All admin routes are protected
router.use(adminProtect);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/analytics', getAnalytics);
router.get('/dashboard/charts/most-viewed-coins', getMostViewedCoins);
router.get('/dashboard/charts/era-popularity', getEraPopularity);
router.get('/dashboard/charts/inquiry-trends', getInquiryTrends);

// Coins CRUD
router.get('/coins', getAllCoins);  // admin sees ALL coins including drafts
router.post('/coins', createCoin);
router.put('/coins/:id', updateCoin);
router.delete('/coins/:id', deleteCoin);
router.patch('/coins/:id/featured', toggleCoinFeatured);
router.post('/coins/upload-image', upload.single('image'), uploadCoinImage);

// Articles CRUD
router.get('/articles', getAllArticles);  // admin sees ALL including drafts
router.post('/articles', createArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);
router.patch('/articles/:id/published', toggleArticlePublished);
router.patch('/articles/:id/featured', toggleArticleFeatured);

// Inquiries
router.get('/inquiries', getAllInquiries);
router.patch('/inquiries/:id/status', updateInquiryStatus);

// Users
router.get('/users', getAllUsers);

module.exports = router;
