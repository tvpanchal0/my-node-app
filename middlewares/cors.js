const cors = require('cors');

// Configure and export CORS middleware
const corsOptions = {
    origin: 'http://localhost:4200', // Allow your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies or auth headers
};

module.exports = cors(corsOptions);
