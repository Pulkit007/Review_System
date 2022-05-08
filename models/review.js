const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewerId: {
        type: String,
        required: true,
    },
    movieName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: Date,
    }
});

module.exports = mongoose.model('Review', reviewSchema);