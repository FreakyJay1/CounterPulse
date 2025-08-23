const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');

// Example sync endpoint for offline/online data
// Accepts arrays of products and sales to upsert, and returns the latest data from the server
router.post('/', async (req, res) => {
  try {
    const { products = [], sales = [] } = req.body;
    // Upsert products
    for (const p of products) {
      await Product.upsert(p);
    }
    // Upsert sales
    for (const s of sales) {
      await Sale.upsert(s);
    }
    // Return latest data from server
    const allProducts = await Product.findAll();
    const allSales = await Sale.findAll();
    res.json({ products: allProducts, sales: allSales });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

