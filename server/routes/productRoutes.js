const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Get all products
router.get('/', ProductController.getAllProducts);
// Get a single product by ID
router.get('/:id', ProductController.getProductById);
// Create a new product
router.post('/', ProductController.createProduct);
// Update a product
router.put('/:id', ProductController.updateProduct);
// Delete a product
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;

