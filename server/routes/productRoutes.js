const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const auth = require('../utils/auth');

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', auth(['owner']), ProductController.createProduct);
router.put('/:id', auth(['owner']), ProductController.updateProduct);
router.delete('/:id', auth(['owner']), ProductController.deleteProduct);
router.get('/search', ProductController.searchProducts);

module.exports = router;
