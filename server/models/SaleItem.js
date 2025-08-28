const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const SaleItem = sequelize.define('SaleItem', {
  saleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Sales',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true, // allow null for ON DELETE SET NULL
    references: {
      model: 'Products',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = SaleItem;
