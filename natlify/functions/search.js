// netlify/functions/search.js
const axios = require('axios');
const mongoose = require('mongoose');
const Cache = require('../../backend/api/models/Cache');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

exports.handler = async (event, context) => {
  const query = event.queryStringParameters.q; // Get query parameter from the request

  try {
    const cachedResult = await Cache.findOne({ query });
    if (cachedResult) {
      return {
        statusCode: 200,
        body: JSON.stringify(cachedResult.results)
      };
    }

    const [stackOverflow, reddit] = await Promise.all([
      axios.get('https://api.stackexchange.com/2.3/search/advanced', {
        params: { order: 'desc', sort: 'relevance', q: query, site: 'stackoverflow' },
      }),
      axios.get('https://www.reddit.com/search.json', { params: { q: query } }),
    ]);

    const results = {
      stackOverflow: stackOverflow.data.items || [],
      reddit: reddit.data.data.children || [],
    };

    const newCache = new Cache({ query, results });
    await newCache.save();

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching data' })
    };
  }
};
