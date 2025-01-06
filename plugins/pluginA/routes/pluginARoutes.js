const express = require('express');
const router = express.Router();

// Define route for Plugin A
router.get('/', (req, res) => {
    res.send('Hello from Plugin A!');
});

module.exports = router;
