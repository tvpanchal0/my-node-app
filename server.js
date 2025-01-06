const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();
// Initialize the Express app
const app = express();
app.use(express.json()); 
app.use(cors()); 
console.log(process.env.MONGODB_URI);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Dynamically load plugins
const pluginsPath = path.join(__dirname, 'plugins');
fs.readdirSync(pluginsPath).forEach((pluginDir) => {
    const pluginPath = path.join(pluginsPath, pluginDir, 'plugin.js');
    if (fs.existsSync(pluginPath)) {
        const plugin = require(pluginPath);
        plugin(app); 
    }
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.use('/api/auth', authRoutes);


// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
