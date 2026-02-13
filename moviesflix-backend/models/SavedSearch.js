const { mongoose } = require("mongoose");

const SavedSearchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    firebaseUid: {
        type: String,
        required: true,
        index: true,
    },
    question: {
        type: String,
        default: "",
    },
    userInput: {
        type: String,
        default: "",
    },
    fullQuestion: {
        type: String,
        required: true,
    },
    movieNames: {
        type: [String],
        required: true
    },
    movieResults: {
        type: [Array], // Array of arrays (each inner array is results for one movie)
        required: true
    },
    customName: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true // Index for sorting by date
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient queries
SavedSearchSchema.index({ firebaseUid: 1, createdAt: -1 });

// Update the updatedAt field before saving
SavedSearchSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SavedSearch', SavedSearchSchema);