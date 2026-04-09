// Import required modules
const express = require('express');
const userRoutes = require('./routes/users');

// Build the server using the Express.js framework
// Initialize the application using express() instance creation
const app = express();
const PORT = 3000;

// Parse incoming JSON data using express.json() middleware
app.use(express.json());

// Mount the user routes on the '/api/users' path
// This maintains modular structure using separation of routes and logic
app.use('/api/users', userRoutes);

// Root route providing a simple res.send response
app.get('/', (req, res) => {
    res.send(`
        <html>
            <body>
                <h1>Welcome to the RESTful API!</h1>
                <p>This API manages a 'users' resource. It uses Express.js and supports GET, POST, PUT, and DELETE methods.</p>
                <ul>
                    <li><a href="/api/users">GET /api/users</a> - View all users</li>
                </ul>
            </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log('====================================');
    console.log(`Server successfully started!`);
    console.log(`Listening on http://localhost:${PORT}`);
    console.log('====================================');
    console.log('Available API Endpoints:');
    console.log('  GET    /api/users       - Get all users');
    console.log('  GET    /api/users/:id   - Get user by ID');
    console.log('  POST   /api/users       - Create a new user');
    console.log('  PUT    /api/users/:id   - Update an existing user');
    console.log('  DELETE /api/users/:id   - Delete a user');
    console.log('====================================');
    console.log('Use tools like Postman, curl, or your browser to test endpoints.');
});
