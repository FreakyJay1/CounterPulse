const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');

router.post('/', async (req, res) => {
  try {
    const { products = [], sales = [] } = req.body;
    for (const p of products) {
      await Product.upsert(p);
    }
    for (const s of sales) {
      await Sale.upsert(s);
    }
    const allProducts = await Product.findAll();
    const allSales = await Sale.findAll();
    res.json({ products: allProducts, sales: allSales });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
