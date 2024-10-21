// backend/models/Cache.js
const mongoose = require('mongoose');

const CacheSchema = new mongoose.Schema({
  query: { type: String, required: true },
  results: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now, expires: 3600 } // 3600 seconds = 1 hour
});

module.exports = mongoose.model('Cache', CacheSchema);
