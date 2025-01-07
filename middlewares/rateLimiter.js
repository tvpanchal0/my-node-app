const rateLimit = require('express-rate-limit');

// Create and export rate-limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    headers: true,
});

module.exports = apiLimiter;
