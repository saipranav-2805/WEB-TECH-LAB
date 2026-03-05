const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'bookFinderDB';
let db;

MongoClient.connect(url)
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);

        // Create sample books if collection is empty
        initializeBooks();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Initialize with sample books data
async function initializeBooks() {
    try {
        const count = await db.collection('books').countDocuments();

        if (count === 0) {
            const sampleBooks = [
                {
                    title: "JavaScript Essentials",
                    author: "John Smith",
                    category: "Programming",
                    price: 450,
                    rating: 4.5,
                    year: 2023
                },
                {
                    title: "Python Mastery",
                    author: "Sarah Johnson",
                    category: "Programming",
                    price: 550,
                    rating: 4.8,
                    year: 2024
                },
                {
                    title: "Web Development Basics",
                    author: "Mike Wilson",
                    category: "Web Development",
                    price: 380,
                    rating: 4.2,
                    year: 2023
                },
                {
                    title: "Database Design",
                    author: "Emily Brown",
                    category: "Database",
                    price: 420,
                    rating: 4.6,
                    year: 2022
                },
                {
                    title: "MongoDB Guide",
                    author: "David Lee",
                    category: "Database",
                    price: 480,
                    rating: 4.9,
                    year: 2024
                },
                {
                    title: "React Fundamentals",
                    author: "Anna Martinez",
                    category: "Web Development",
                    price: 520,
                    rating: 4.7,
                    year: 2023
                },
                {
                    title: "Java Programming",
                    author: "Robert Taylor",
                    category: "Programming",
                    price: 600,
                    rating: 4.4,
                    year: 2022
                },
                {
                    title: "SQL Mastery",
                    author: "Lisa Anderson",
                    category: "Database",
                    price: 400,
                    rating: 4.3,
                    year: 2023
                },
                {
                    title: "HTML & CSS Guide",
                    author: "James Wilson",
                    category: "Web Development",
                    price: 320,
                    rating: 4.1,
                    year: 2024
                },
                {
                    title: "Data Structures",
                    author: "Patricia White",
                    category: "Computer Science",
                    price: 580,
                    rating: 4.8,
                    year: 2023
                },
                {
                    title: "Algorithms Explained",
                    author: "Thomas Brown",
                    category: "Computer Science",
                    price: 620,
                    rating: 4.9,
                    year: 2024
                },
                {
                    title: "C++ Programming",
                    author: "Jennifer Davis",
                    category: "Programming",
                    price: 530,
                    rating: 4.5,
                    year: 2022
                }
            ];

            await db.collection('books').insertMany(sampleBooks);
            console.log('Sample books added to database');
        }
    } catch (err) {
        console.error('Error initializing books:', err);
    }
}

// Routes

// 1. Search Books by Title (case-insensitive)
app.get('/books/search', async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ error: 'Title parameter is required' });
        }

        const books = await db.collection('books')
            .find({
                title: {
                    $regex: title,
                    $options: 'i'
                }
            })
            .toArray();

        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Filter Books by Category
app.get('/books/category/:category', async (req, res) => {
    try {
        const { category } = req.params;

        const books = await db.collection('books')
            .find({
                category: {
                    $regex: new RegExp(`^${category}$`, 'i')
                }
            })
            .toArray();

        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Sort Books by Price or Rating
app.get('/books/sort/:criteria', async (req, res) => {
    try {
        const { criteria } = req.params;
        const { order = 'asc' } = req.query;

        let sortOption = {};

        if (criteria === 'price') {
            sortOption = { price: order === 'desc' ? -1 : 1 };
        } else if (criteria === 'rating') {
            sortOption = { rating: order === 'desc' ? -1 : 1 };
        } else {
            return res.status(400).json({ error: 'Invalid sort criteria. Use "price" or "rating"' });
        }

        const books = await db.collection('books')
            .find()
            .sort(sortOption)
            .toArray();

        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Top Rated Books (rating >= 4, limit 5)
app.get('/books/top', async (req, res) => {
    try {
        const books = await db.collection('books')
            .find({ rating: { $gte: 4 } })
            .sort({ rating: -1 })
            .limit(5)
            .toArray();

        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Pagination
app.get('/books', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const books = await db.collection('books')
            .find()
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await db.collection('books').countDocuments();

        res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            books
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all unique categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await db.collection('books')
            .distinct('category');

        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get book by ID (for additional details if needed)
app.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid book ID' });
        }

        const book = await db.collection('books')
            .findOne({ _id: new ObjectId(id) });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Handle port conflicts
function startServer(port) {
    const server = app.listen(port)
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy, trying ${port + 1}...`);
                startServer(port + 1);
            } else {
                console.error('Server error:', err);
            }
        })
        .on('listening', () => {
            console.log(`Server running on http://localhost:${port}`);
            console.log('Online Book Finder is ready!');
        });
}

startServer(PORT);