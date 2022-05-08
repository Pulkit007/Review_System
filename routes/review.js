const express = require('express');
const { createReview, updateReview, getAllReviews, getAverageRating, deleteReview } = require('../controllers/review');
const router = express.Router();

router.get('/all', getAllReviews);
router.post('/create', createReview);
router.put('/update', updateReview);
router.delete('/delete', deleteReview);
router.get('/average', getAverageRating);

module.exports = router;