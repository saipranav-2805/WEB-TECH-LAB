const Product = require('../models/Product');

// GET all products - Retrieve data using find() method
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ status: 'success', count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// GET a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.json({ status: 'success', data: product });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// POST - Insert data into the database using create() method
exports.createProduct = async (req, res) => {
    try {
        // Handle asynchronous database operations using async/await
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            status: 'success',
            data: newProduct,
            message: 'Product created successfully'
        });
    } catch (err) {
        // Mongoose validation errors will surface here
        res.status(400).json({ status: 'error', message: err.message });
    }
};

// PUT - Update records using findByIdAndUpdate()
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,       // Return the updated document
                runValidators: true  // Run schema validators on update
            }
        );
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.json({ status: 'success', data: updatedProduct, message: 'Product updated successfully' });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
};

// DELETE - Delete records using findByIdAndDelete()
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.json({ status: 'success', data: deletedProduct, message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
