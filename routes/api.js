const express = require('express');
const router = express.Router();

// Example of an API route
router.get('/users', (req, res) => {
    res.json({ message: 'Fetch users' });
});

module.exports = router;
