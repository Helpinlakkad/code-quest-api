// backend/controllers/searchController.js
const axios = require('axios');
const Cache = require('../models/Cache'); // Cache model

exports.searchQuery = async (req, res) => {
  const query = req.query.q;

  try {
    // Check if the query results are cached
    const cachedResult = await Cache.findOne({ query });
    if (cachedResult) {
      console.log(`Serving cached results for query: "${query}"`);
      return res.json(cachedResult.results);
    }

    // If no cache exists, fetch from APIs
    const [stackOverflow, reddit] = await Promise.all([
      axios.get('https://api.stackexchange.com/2.3/search/advanced', {
        params: { order: 'desc', sort: 'relevance', q: query, site: 'stackoverflow' }
      }),
      axios.get('https://www.reddit.com/search.json', { params: { q: query } })
    ]);

    const results = {
      stackOverflow: stackOverflow.data.items || [],
      reddit: reddit.data.data.children || []
    };

    // Save the new result to the cache
    const newCache = new Cache({ query, results });
    await newCache.save();
    console.log(`Caching results for query: "${query}"`);

    // Send the results to the client
    res.json(results);

  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
};
