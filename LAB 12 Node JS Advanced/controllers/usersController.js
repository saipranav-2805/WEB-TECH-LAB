// In-memory data store for users
let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    { id: 4, name: 'David', email: 'david@example.com' },
    { id: 5, name: 'Eve', email: 'eve@example.com' }
];

// Get all users
exports.getAllUsers = (req, res) => {
    // Send structured responses using res.json()
    res.json({ status: 'success', data: users });
};

// Get a single user by ID
exports.getUserById = (req, res) => {
    // Extract route parameter 'id'
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'success', data: user });
};

// Create a new user
exports.createUser = (req, res) => {
    // Accept and process request data using req.body
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ status: 'error', message: 'Name and email are required' });
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1, // Simple auto-increment ID
        name,
        email
    };

    users.push(newUser);
    res.status(201).json({ status: 'success', data: newUser, message: 'User created successfully' });
};

// Update an existing user
exports.updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Update data
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;

    res.json({ status: 'success', data: users[userIndex], message: 'User updated successfully' });
};

// Delete a user
exports.deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1);
    res.json({ status: 'success', data: deletedUser[0], message: 'User deleted successfully' });
};
