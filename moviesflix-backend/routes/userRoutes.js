const express = require('express');
const { addToWatchListMovies, getWatchListMovies, removeFromWatchList, generateChat, saveAiSearch, getSavedAiSearches, deleteSavedAiSearch, updateSavedAiSearchName, getSavedAiSearchById, addToLikedMovies, addToDislikedMovies, removeFromDislikedMovies, removeFromLikedMovies, getLikedMovies, getDislikedMovies } = require('../controllers/UserController');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();


router.post('/add', verifyToken, addToWatchListMovies);
router.get('/watchlist', verifyToken, getWatchListMovies);
router.put('/remove', verifyToken, removeFromWatchList);
router.post('/generate-chat-response', verifyToken, generateChat);

router.post('/save-ai-search', verifyToken, saveAiSearch);
router.get('/get-saved-ai-searches', verifyToken, getSavedAiSearches);
router.delete('/delete-saved-ai-search', verifyToken, deleteSavedAiSearch);
router.put('/update-saved-ai-search-name', verifyToken, updateSavedAiSearchName);
router.get('/get-saved-ai-search-by-id/:searchId', verifyToken, getSavedAiSearchById);

// Add these routes to the router (after the existing routes)
router.post('/like', verifyToken, addToLikedMovies);
router.post('/dislike', verifyToken, addToDislikedMovies);
router.put('/unlike', verifyToken, removeFromLikedMovies);
router.put('/undislike', verifyToken, removeFromDislikedMovies);
router.get('/liked-movies', verifyToken, getLikedMovies);
router.get('/disliked-movies', verifyToken, getDislikedMovies);

module.exports = router;