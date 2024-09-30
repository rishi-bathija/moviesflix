const express = require('express');
const { addToWatchListMovies, getWatchListMovies, removeFromWatchList } = require('../controllers/UserController');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();


router.post('/add', verifyToken, addToWatchListMovies);
router.get('/watchlist', verifyToken, getWatchListMovies);
router.put('/remove', verifyToken, removeFromWatchList);

module.exports = router;