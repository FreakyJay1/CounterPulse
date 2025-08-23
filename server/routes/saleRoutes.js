const express = require('express');
const router = express.Router();
const SaleController = require('../controllers/SaleController');

router.get('/', SaleController.getAllSales);
router.get('/:id', SaleController.getSaleById);
router.post('/', SaleController.createSale);
router.put('/:id', SaleController.updateSale);
router.delete('/:id', SaleController.deleteSale);
router.get('/report/total', SaleController.getTotalSales);
router.get('/report/by-product', SaleController.getSalesByProduct);
router.get('/report/by-date', SaleController.getSalesByDateRange);

module.exports = router;
