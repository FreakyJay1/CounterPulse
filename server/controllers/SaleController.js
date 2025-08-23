const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new sale
exports.createSale = async (req, res) => {
  try {
    const { productId, quantity, total } = req.body;
    const sale = await Sale.create({ productId, quantity, total });
    // Update product quantity
    const product = await Product.findByPk(productId);
    if (product) {
      product.quantity -= quantity;
      await product.save();
    }
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a sale
exports.updateSale = async (req, res) => {
  try {
    const { productId, quantity, total } = req.body;
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    await sale.update({ productId, quantity, total });
    res.json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    await sale.destroy();
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- SALES REPORTING ENDPOINTS ---

// Get total sales amount
exports.getTotalSales = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    const total = sales.reduce((sum, s) => sum + (s.total || 0), 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sales by product
exports.getSalesByProduct = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    const byProduct = {};
    sales.forEach(s => {
      byProduct[s.productId] = (byProduct[s.productId] || 0) + (s.total || 0);
    });
    res.json(byProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sales in a date range
exports.getSalesByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    const where = {};
    if (start && end) {
      where.createdAt = { $gte: new Date(start), $lte: new Date(end) };
    }
    const sales = await Sale.findAll({ where });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
