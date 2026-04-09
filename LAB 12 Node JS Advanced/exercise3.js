const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');

// Initialize Express app
const app = express();
const PORT = 3003;

// ============================================================
// MONGODB CONNECTION STRING
// Replace the URI below with your own MongoDB Atlas URI or
// keep it as-is if you have MongoDB running locally.
// ============================================================
const MONGO_URI = 'mongodb://localhost:27017/lab12_exercise3';

// Parse incoming JSON data
app.use(express.json());

// Mount product routes
app.use('/api/products', productRoutes);

// Root route - API info
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Exercise 3: MongoDB CRUD API with Mongoose',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        endpoints: {
            'GET    /api/products':      'Get all products',
            'GET    /api/products/:id':  'Get a product by ID',
            'POST   /api/products':      'Create a new product',
            'PUT    /api/products/:id':  'Update a product by ID',
            'DELETE /api/products/:id':  'Delete a product by ID'
        },
        sampleBody: {
            name: 'Wireless Mouse',
            price: 29.99,
            category: 'Electronics',
            inStock: true
        }
    });
});

// ============================================================
// DATABASE CONNECTION & SERVER START
// Manage database connection using connection handling in Mongoose
// ============================================================
const startServer = async () => {
    try {
        console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected successfully!');

        // Start Express server only after DB is connected
        app.listen(PORT, () => {
            console.log('==============================================');
            console.log(` Exercise 3 - MongoDB CRUD API`);
            console.log(` Server running at http://localhost:${PORT}`);
            console.log('==============================================');
            console.log(' API Endpoints:');
            console.log(`   GET    http://localhost:${PORT}/api/products`);
            console.log(`   GET    http://localhost:${PORT}/api/products/:id`);
            console.log(`   POST   http://localhost:${PORT}/api/products`);
            console.log(`   PUT    http://localhost:${PORT}/api/products/:id`);
            console.log(`   DELETE http://localhost:${PORT}/api/products/:id`);
            console.log('==============================================');
        });

    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        console.error('   Make sure MongoDB is running locally, or update MONGO_URI with your Atlas connection string.');
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected!');
});

mongoose.connection.on('reconnected', () => {
    console.log('♻️  MongoDB reconnected.');
});

// Graceful shutdown on CTRL+C
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed. Shutting down...');
    process.exit(0);
});

startServer();
