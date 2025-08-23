const express = require('express');
const router = express.Router();
const SaleController = require('../controllers/SaleController');
const auth = require('../utils/auth');

router.get('/', SaleController.getAllSales);
router.get('/:id', SaleController.getSaleById);
router.post('/', SaleController.createSale);
router.put('/:id', SaleController.updateSale);
router.delete('/:id', SaleController.deleteSale);
router.get('/report/total', auth(['owner']), SaleController.getTotalSales);
router.get('/report/by-product', auth(['owner']), SaleController.getSalesByProduct);
router.get('/report/by-date', auth(['owner']), SaleController.getSalesByDateRange);

module.exports = router;
