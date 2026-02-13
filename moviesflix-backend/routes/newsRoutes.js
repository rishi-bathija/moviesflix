const express = require('express');
const { getEntertainmentNews } = require('../controllers/NewController');

const router = express.Router();

// Public route; no auth required
router.get('/entertainment', getEntertainmentNews);

module.exports = router;