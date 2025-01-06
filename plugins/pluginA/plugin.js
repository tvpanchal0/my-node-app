const config = require('./plugin-config.json');


module.exports = (app) => {
    if (config.enabled) {
        console.log('Plugin A Initialized');
        
        // Register routes for Plugin A
        app.use('/pluginA', require('./routes/pluginARoutes'));
    }
};
