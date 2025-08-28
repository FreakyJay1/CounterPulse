const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const Product = require('../models/Product');
const { sequelize } = require('../models');

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [{
        model: SaleItem,
        include: [{ model: Product, attributes: ['id', 'name', 'price', 'costPrice'] }]
      }],
      order: [['date', 'DESC']]
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [{
        model: SaleItem,
        include: [{ model: Product, attributes: ['id', 'name', 'price', 'costPrice'] }]
      }]
    });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSale = async (req, res) => {
  const { items, clientId } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    console.log('Error: No sale items provided.');
    return res.status(400).json({ error: 'No sale items provided.' });
  }
  try {
    if (clientId) {
      const existingSale = await Sale.findOne({ where: { clientId } });
      if (existingSale) {
        return res.status(200).json(existingSale);
      }
    }
    let saleCreated = null;
    await sequelize.transaction(async (t) => {
      let saleTotal = 0;
      for (const item of items) {
        const product = await Product.findByPk(item.productId, { lock: t.LOCK.UPDATE, transaction: t });
        if (!product) {
          console.log('Error: Product not found:', item.productId);
          throw new Error('Product not found: ' + item.productId);
        }
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          console.log('Error: Invalid quantity for product:', product.name, item.quantity);
          throw new Error('Invalid quantity for product: ' + product.name);
        }
        if (product.quantity < item.quantity) {
          console.log('Error: Not enough stock for', product.name, 'Available:', product.quantity, 'Requested:', item.quantity);
          throw new Error(`Not enough stock for ${product.name}. Available: ${product.quantity}`);
        }
        saleTotal += item.total;
      }
      saleCreated = await Sale.create({ total: saleTotal }, { transaction: t });
      for (const item of items) {
        await SaleItem.create({
          saleId: saleCreated.id,
          productId: item.productId,
          quantity: item.quantity,
          total: item.total
        }, { transaction: t });
        const product = await Product.findByPk(item.productId, { transaction: t });
        product.quantity -= item.quantity;
        await product.save({ transaction: t });
      }
    });
    if (saleCreated) {
      return res.status(201).json(saleCreated);
    } else {
      return res.status(400).json({ error: 'Sale could not be completed.' });
    }
  } catch (err) {
    console.log('Sale creation error:', err.message);
    return res.status(400).json({ error: err.message });
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
