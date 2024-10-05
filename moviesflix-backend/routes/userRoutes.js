const express = require('express');
const { addToWatchListMovies, getWatchListMovies, removeFromWatchList, generateChat } = require('../controllers/UserController');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();


router.post('/add', verifyToken, addToWatchListMovies);
router.get('/watchlist', verifyToken, getWatchListMovies);
router.put('/remove', verifyToken, removeFromWatchList);
router.post('/generate-chat-response', verifyToken, generateChat);

module.exports = router;