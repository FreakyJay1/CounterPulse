const { randomUUID } = require('crypto');
const { Product } = require('../models');
const Sale = require('../models/Sale');
const { Op } = require('sequelize');

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      order: [['date', 'DESC']],
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'costPrice']
      }]
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales.' });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message, details: err });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { products, productId, quantity, total } = req.body;
    if (Array.isArray(products) && products.length > 0) {
      const transactionId = randomUUID();
      try {
        await sequelize.transaction(async (t) => {
          for (const item of products) {
            const { productId, quantity } = item;
            const productForUpdate = await Product.findByPk(productId, { lock: t.LOCK.UPDATE, transaction: t });
            if (!productForUpdate) throw new Error(`Product not found: productId=${productId}`);
            if (!Number.isInteger(quantity) || quantity <= 0) throw new Error(`Invalid sale quantity for productId=${productId}: quantity=${quantity}`);
            if (productForUpdate.quantity < quantity) throw new Error(`Not enough stock for ${productForUpdate.name} (productId=${productId}). Available: ${productForUpdate.quantity}, Requested: ${quantity}`);
          }
          for (const item of products) {
            const { productId, quantity } = item;
            const productForUpdate = await Product.findByPk(productId, { lock: t.LOCK.UPDATE, transaction: t });
            await Sale.create({ productId, quantity, total: (productForUpdate.price || 0) * quantity, transactionId }, { transaction: t });
            productForUpdate.quantity -= quantity;
            await productForUpdate.save({ transaction: t });
          }
        });
        return res.json({ message: 'Multi-product sale logged successfully!' });
      } catch (err) {
        return res.status(400).json({ error: err.message, details: err });
      }
    } else {
      try {
        const transactionId = randomUUID();
        await sequelize.transaction(async (t) => {
          const productForUpdate = await Product.findByPk(productId, { lock: t.LOCK.UPDATE, transaction: t });
          if (!productForUpdate) throw new Error('Product not found');
          if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Invalid sale quantity');
          if (productForUpdate.quantity < quantity) throw new Error(`Not enough stock to complete the sale. Available: ${productForUpdate.quantity}`);
          saleCreated = await Sale.create({ productId, quantity, total, transactionId }, { transaction: t });
          productForUpdate.quantity -= quantity;
          await productForUpdate.save({ transaction: t });
        });
        return res.json({ message: 'Sale logged successfully!' });
      } catch (err) {
        return res.status(400).json({ error: err.message, details: err });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message, details: err });
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
    const sales = await Sale.findAll({ include: [{ model: Product, attributes: ['name'] }] });
    const byProduct = {};
    sales.forEach(s => {
      const name = s.Product ? s.Product.name : s.productId;
      if (!byProduct[name]) {
        byProduct[name] = { name, quantity: 0, total: 0, count: 0 };
      }
      byProduct[name].quantity += Number(s.quantity) || 0;
      byProduct[name].total += Number(s.total) || 0;
      byProduct[name].count += 1;
    });
    const result = Object.values(byProduct).map(p => ({
      ...p,
      average: p.quantity > 0 ? (p.total / p.quantity) : 0
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
