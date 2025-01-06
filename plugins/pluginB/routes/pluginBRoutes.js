const express = require('express');
const router = express.Router();

// Define route for Plugin B
router.get('/', (req, res) => {
    res.send('Hello from Plugin B!');
});

module.exports = router;
