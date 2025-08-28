const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Sale = sequelize.define('Sale', {
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
});

module.exports = Sale;
