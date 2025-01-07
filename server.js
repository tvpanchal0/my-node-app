const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const http = require('http'); // Add HTTP server for WebSocket
const socketIo = require('socket.io'); // Add socket.io


require('dotenv').config();

// Initialize the Express app
const app = express();
app.use(express.json()); 

app.use(express.static(path.join(__dirname, 'public')));


// Middleware imports
const apiLimiter = require('./middlewares/rateLimiter');
const corsMiddleware = require('./middlewares/cors');
// Apply rate-limiting to API routes
// Use middlewares
app.use(corsMiddleware);
app.use('/api/', apiLimiter); // Apply rate-limiting to API routes

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

// Create an HTTP server to handle both HTTP and WebSocket requests
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200", // Only allow your frontend URL (e.g., Angular app running on localhost:4200)
        methods: ["GET", "POST"]
    }
});
// WebSocket event handling
// Store connected users
let users = [];

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Listen for new user joining
    socket.on('join', (username) => {
        users.push({ id: socket.id, username: username });
        io.emit('user list', users); // Send updated user list to all clients
    });

    // Handle incoming chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);  // Broadcast message to all clients
    });

    // Listen for typing notifications
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);  // Broadcast typing status to others
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        users = users.filter(user => user.id !== socket.id);
        io.emit('user list', users); // Update user list
    });
});

// Default route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use('/api/auth', authRoutes);

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
