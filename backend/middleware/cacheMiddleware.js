const NodeCache = require('node-cache');

// Standard TTL of 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const cacheMiddleware = (duration) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  } else {
    // Intercept res.json to save the response in cache before sending
    const originalJson = res.json;
    res.json = (body) => {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body, duration || 300);
      }
      return originalJson.call(res, body);
    };
    next();
  }
};

// Expose the cache instance to clear it manually in controllers
const clearCache = (prefix) => {
  const keys = cache.keys();
  for (const key of keys) {
    if (key.startsWith(prefix)) {
      cache.del(key);
    }
  }
};

module.exports = {
  cacheMiddleware,
  clearCache,
};
