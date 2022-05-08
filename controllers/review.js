const Review = require('../models/review');

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ result: reviews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const createReview = async (req, res) => {
    const { reviewerId, movieName, rating } = req.body;
    try {
        const hasAlreadyReviewed = await Review.findOne({ reviewerId, movieName });
        if (hasAlreadyReviewed) {
            try {
                const review = await Review.findOneAndUpdate({ reviewerId, movieName }, { rating, lastUpdated: new Date() }, { new: true });
                res.status(200).json({ result: review });
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
            return;
        }
        const review = await Review.create({
            reviewerId,
            movieName,
            rating,
            lastUpdated: new Date(),
        });
        res.status(200).json({ result: review });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const updateReview = async (req, res) => {
    const { reviewerId, movieName, rating } = req.body;
    try {
        const review = await Review.findOneAndUpdate({ reviewerId, movieName }, { rating, lastUpdated: new Date() }, { new: true });
        res.status(200).json({ result: review });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteReview = async (req, res) => {
    const { reviewerId, movieName } = req.body;
    try {
        const review = await Review.findOneAndDelete({ reviewerId, movieName });
        res.status(200).json({ result: review, message: 'Review deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAverageRating = async (req, res) => {
    const { movieName } = req.body;
    try {
        const regex = new RegExp(movieName, 'i')
        const reviews = await Review.find({ movieName: { $regex: regex } });
        const movieReviews = new Map();
        reviews.forEach(review => {
            if (!movieReviews.has(review.movieName)) {
                movieReviews.set(review.movieName, []);
            }
            movieReviews.get(review.movieName).push(review.rating);
        });
        const averageRatingsForMovie = [];
        movieReviews.forEach((ratings, movie) => {
            const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
            averageRatingsForMovie.push({ movie, averageRating });
        });
        res.status(200).json({ result: averageRatingsForMovie });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getAllReviews,
    createReview,
    updateReview,
    deleteReview,
    getAverageRating
}