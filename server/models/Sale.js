const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Sale = sequelize.define('Sale', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

const Product = require('./Product');
Sale.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

module.exports = Sale;
