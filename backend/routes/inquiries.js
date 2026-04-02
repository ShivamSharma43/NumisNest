const express = require('express');
const router = express.Router();
const { createInquiry, getUserInquiries, getInquiry, cancelInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createInquiry);
router.get('/', getUserInquiries);
router.get('/:id', getInquiry);
router.delete('/:id', cancelInquiry);

module.exports = router;