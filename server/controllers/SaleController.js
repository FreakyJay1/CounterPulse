const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({ include: [{ model: Product, attributes: ['name'] }] });
    const salesWithProductName = sales.map(sale => ({
      id: sale.id,
      productName: sale.Product ? sale.Product.name : sale.productId,
      quantity: sale.quantity,
      total: sale.total,
      date: sale.date
    }));
    res.json(salesWithProductName);
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
    const sequelize = require('../models/index');
    let saleCreated = null;
    try {
      await sequelize.transaction(async (t) => {
        const productForUpdate = await Product.findByPk(productId, { lock: t.LOCK.UPDATE, transaction: t });
        console.log('[SALE] Fetched product for update:', productForUpdate ? productForUpdate.id : null, 'Current qty:', productForUpdate ? productForUpdate.quantity : null);
        if (!productForUpdate) {
          throw new Error('Product not found');
        }
        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error('Invalid sale quantity');
        }
        if (productForUpdate.quantity < quantity) {
          console.log('[SALE] Not enough stock. Requested:', quantity, 'Available:', productForUpdate.quantity);
          throw new Error(`Not enough stock to complete the sale. Available: ${productForUpdate.quantity}`);
        }
        saleCreated = await Sale.create({ productId, quantity, total }, { transaction: t });
        productForUpdate.quantity -= quantity;
        await productForUpdate.save({ transaction: t });
        console.log('[SALE] Sale created. New product qty:', productForUpdate.quantity);
      });
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeValidationError') {
        console.log('[SALE] DB constraint error:', err.message);
        return res.status(400).json({ error: 'Database constraint error: ' + err.message });
      }
      console.log('[SALE] Transaction error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    if (saleCreated) {
      return res.status(201).json(saleCreated);
    } else {
      return res.status(400).json({ error: 'Sale could not be completed.' });
    }
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
    const sales = await Sale.findAll({ include: [{ model: Product, attributes: ['name'] }] });
    const byProduct = {};
    sales.forEach(s => {
      const t = Number(s.total) || 0;
      const name = s.Product ? s.Product.name : s.productId;
      byProduct[name] = (byProduct[name] || 0) + t;
    });
    res.json(byProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
