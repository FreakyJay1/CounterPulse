const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, barcode, quantity, costPrice } = req.body;
    const product = await Product.create({ name, category, price, barcode, quantity, costPrice });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log('Received update for product:', req.params.id, req.body);
    const { name, category, price, barcode, quantity, costPrice } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.update({ name, category, price, barcode, quantity, costPrice });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    console.error('Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    if (
      err.name === 'SequelizeForeignKeyConstraintError' ||
      (err.name === 'SequelizeDatabaseError' && err.parent && err.parent.code === '23503')
    ) {
      return res.status(409).json({ error: 'Cannot delete product: it is referenced in other records (e.g., sales).' });
    }
    res.status(500).json({ error: err.message || 'Internal server error', details: err, parent: err.parent });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });
    const products = await Product.findAll({
      where: {
        [Product.sequelize.Op.or]: [
          { name: { [Product.sequelize.Op.iLike]: `%${query}%` } },
          { barcode: { [Product.sequelize.Op.iLike]: `%${query}%` } }
        ]
      }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
