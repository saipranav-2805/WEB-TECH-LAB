const mongoose = require('mongoose');

// Define a schema using Mongoose schema definition
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        inStock: {
            type: Boolean,
            default: true
        }
    },
    {
        // Automatically adds 'createdAt' and 'updatedAt' fields
        timestamps: true
    }
);

// Create a model using Mongoose model creation
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
