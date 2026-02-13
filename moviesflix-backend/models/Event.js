const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    type: {
        type: String,
        enum: ['like', 'dislike', 'watchlist_add', 'watchlist_remove', 'news_read', 'saved_search', 'movie_view', 'cast_view'],
        required: true,
        index: true,
    },
    targetId:{
        type: String,
        required: true,
    },
    targetType: {
        type: String,
        enum: ['movie', 'search', 'news'],
    },
    metadata:{
        movieTitle: String,
        searchQuery: String,
        newsTitle: String,
        newsCategory: String,
        duration: Number,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// Compound index for efficient queries by user and time or by user and event type
EventSchema.index({ firebaseUid: 1, timestamp: -1 });
EventSchema.index({firebaseUid: 1, type: 1})

module.exports = mongoose.model('Event', EventSchema);