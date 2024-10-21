// backend/routes/searchRoutes.js
const express = require('express');
const { searchQuery } = require('../controllers/searchController');
const router = express.Router();

// Define the search route directly
router.get('/', (req, res) => {
  res.json({ message: 'Search API is working' });
});

router.get('/query', searchQuery); // Changed from /search to /query

module.exports = router;
