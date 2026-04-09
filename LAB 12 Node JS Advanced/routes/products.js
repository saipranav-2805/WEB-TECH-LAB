const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products       - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/:id   - Get a single product by ID
router.get('/:id', productController.getProductById);

// POST /api/products      - Create a new product
router.post('/', productController.createProduct);

// PUT /api/products/:id   - Update a product
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
