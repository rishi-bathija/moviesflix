const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    watchlistMovies: {
        type: Array,
    },
    likedMovies: {
        type: Array,
    },
    dislikedMovies: {
        type: Array,
    },
})

module.exports = mongoose.model('User', UserSchema);