const config = require('./plugin-config.json');
const path = require('path');

module.exports = (app) => {
    if (config.enabled) {
        console.log('Plugin B Initialized');
        
        // Register routes for Plugin B
        app.use('/pluginB', require('./routes/pluginBRoutes'));
    }
};
