const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Changed default to 3001

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'studentNotesDB';
let db;

MongoClient.connect(url)
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);

        // Create a sample note if collection is empty (for testing)
        db.collection('notes').countDocuments().then(count => {
            if (count === 0) {
                const sampleNote = {
                    title: 'Sample Note',
                    subject: 'Getting Started',
                    description: 'This is a sample note to get you started. You can add, edit, and delete notes.',
                    created_date: new Date().toISOString().split('T')[0]
                };
                db.collection('notes').insertOne(sampleNote);
                console.log('Sample note created');
            }
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes

// Get all notes
app.get('/notes', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }
        const notes = await db.collection('notes').find().toArray();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new note
app.post('/notes', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const { title, subject, description } = req.body;

        // Validate input
        if (!title || !subject || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Get current date in YYYY-MM-DD format
        const today = new Date();
        const created_date = today.toISOString().split('T')[0];

        const newNote = {
            title,
            subject,
            description,
            created_date
        };

        const result = await db.collection('notes').insertOne(newNote);
        res.status(201).json({
            message: 'Note added successfully',
            noteId: result.insertedId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update note
app.put('/notes/:id', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const { id } = req.params;
        const { title, description } = req.body;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid note ID' });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        const result = await db.collection('notes').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ message: 'Note updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete note
app.delete('/notes/:id', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid note ID' });
        }

        const result = await db.collection('notes').deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Handle port conflicts by trying alternative ports
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
            console.log(`Press Ctrl+C to stop the server`);
        });
}

// Start the server with initial port
startServer(PORT);