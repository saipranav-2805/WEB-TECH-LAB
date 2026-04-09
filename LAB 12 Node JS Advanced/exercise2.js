const express = require('express');

// Initialize the application using express() instance creation
const app = express();
const PORT = 3002;

// Parse incoming JSON data
app.use(express.json());

// ============================================================
// APPLICATION-LEVEL MIDDLEWARE (Global - applies to all routes)
// ============================================================

// Middleware 1: Request Logger
// Logs request details (method, URL, timestamp) using custom middleware
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[Logger]    ${timestamp} | ${req.method} ${req.url}`);
    // Control request flow using the next() function - passes to the next middleware
    next();
};

// Middleware 2: Request Preprocessor
// Attaches a unique request ID to every incoming request for tracing
const requestPreprocessor = (req, res, next) => {
    req.requestId = `REQ-${Date.now()}`;
    req.receivedAt = new Date().toISOString();
    console.log(`[Preprocess] Assigned Request ID: ${req.requestId}`);
    next();
};

// Middleware 3: Response Timer
// Calculates and logs how long each request takes to process
const responseTimer = (req, res, next) => {
    const startTime = process.hrtime();
    // Intercept res.json to log timing after a response is sent
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        const diff = process.hrtime(startTime);
        const durationMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(3);
        console.log(`[Timer]     Request ${req.requestId} completed in ${durationMs}ms`);
        return originalJson(body);
    };
    next();
};

// Apply middleware globally using app.use() (application-level middleware)
// These run for every request in the order they are defined
app.use(requestLogger);
app.use(requestPreprocessor);
app.use(responseTimer);

// ============================================================
// ROUTE-LEVEL MIDDLEWARE (Applies only to specific routes)
// ============================================================

// Route-level middleware: Validates that a required 'name' field exists on POST
const validateName = (req, res, next) => {
    console.log(`[Validate]  Running route-level validation for POST /api/items`);
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed: "name" field is required and cannot be empty.'
        });
    }
    console.log(`[Validate]  Validation passed. "name" is: "${name}"`);
    next();
};

// Route-level middleware: Simulates an authentication check for secure routes
const authCheck = (req, res, next) => {
    console.log(`[AuthCheck] Running route-level auth check for ${req.method} ${req.url}`);
    const token = req.headers['authorization'];
    if (!token || token !== 'Bearer secret-token') {
        return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid or missing token.' });
    }
    console.log(`[AuthCheck] Authorization successful.`);
    next();
};

// ============================================================
// IN-MEMORY DATA STORE
// ============================================================
let items = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Keyboard' },
    { id: 3, name: 'Mouse' }
];

// ============================================================
// ROUTES
// ============================================================

// GET / - Root route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        requestId: req.requestId,
        message: 'Welcome to the Middleware Demo API!',
        endpoints: {
            'GET /api/items': 'Get all items (public)',
            'POST /api/items': 'Create item (validates "name" field)',
            'GET /api/items/secure': 'Get items (requires Authorization header)',
            'DELETE /api/items/:id': 'Delete item by ID (requires Authorization header)'
        }
    });
});

// GET /api/items - Public route (only global middleware applies)
app.get('/api/items', (req, res) => {
    console.log(`[Route]     Handling GET /api/items`);
    res.json({ status: 'success', requestId: req.requestId, data: items });
});

// POST /api/items - Route with route-level 'validateName' middleware chained
// 'validateName' runs BEFORE the final route handler
app.post('/api/items', validateName, (req, res) => {
    console.log(`[Route]     Handling POST /api/items`);
    const newItem = {
        id: items.length ? items[items.length - 1].id + 1 : 1,
        name: req.body.name
    };
    items.push(newItem);
    res.status(201).json({ status: 'success', requestId: req.requestId, data: newItem, message: 'Item created.' });
});

// GET /api/items/secure - Route requiring auth (route-level 'authCheck' middleware)
app.get('/api/items/secure', authCheck, (req, res) => {
    console.log(`[Route]     Handling GET /api/items/secure`);
    res.json({ status: 'success', requestId: req.requestId, message: 'Access granted to secure data!', data: items });
});

// DELETE /api/items/:id - Applies both auth + a route handler using dynamic routing
// Demonstrates middleware chaining with multiple route-level middleware
app.delete('/api/items/:id', authCheck, (req, res) => {
    console.log(`[Route]     Handling DELETE /api/items/${req.params.id}`);
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) {
        return res.status(404).json({ status: 'error', message: 'Item not found.' });
    }
    const deleted = items.splice(index, 1);
    res.json({ status: 'success', requestId: req.requestId, data: deleted[0], message: 'Item deleted.' });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log('==============================================');
    console.log(` Middleware Demo Server running!`);
    console.log(` http://localhost:${PORT}`);
    console.log('==============================================');
    console.log(' Global middleware active:');
    console.log('   1. requestLogger  - Logs method, URL, timestamp');
    console.log('   2. requestPreprocessor - Adds Request ID');
    console.log('   3. responseTimer  - Measures response time');
    console.log(' Route-level middleware:');
    console.log('   - validateName    -> POST /api/items');
    console.log('   - authCheck       -> GET /api/items/secure');
    console.log('   - authCheck       -> DELETE /api/items/:id');
    console.log('==============================================');
    console.log(' Auth header for secure routes:');
    console.log('   Authorization: Bearer secret-token');
    console.log('==============================================');
});
