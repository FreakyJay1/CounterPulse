const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { productId, quantity, total } = req.body;
    const sale = await Sale.create({ productId, quantity, total });
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

exports.getTotalSales = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    const total = sales.reduce((sum, s) => sum + (Number(s.total) || 0), 0);
    res.json({ total: Number(total) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSalesByProduct = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    const byProduct = {};
    sales.forEach(s => {
      const t = Number(s.total) || 0;
      byProduct[s.productId] = (byProduct[s.productId] || 0) + t;
    });
    Object.keys(byProduct).forEach(pid => {
      byProduct[pid] = Number(byProduct[pid]);
    });
    res.json(byProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
