const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Sale = sequelize.define('Sale', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
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
    field: 'sold_at',
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'transactionId',
  },
}, {
  tableName: 'sales',
  timestamps: false
});

const Product = require('./Product');
Sale.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

module.exports = Sale;
