const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: 'Username is required' },
      notEmpty: { msg: 'Username cannot be empty' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Password is required' },
      notEmpty: { msg: 'Password cannot be empty' },
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['owner', 'assistant', 'user']],
        msg: 'Role must be owner, assistant, or user',
      },
      notNull: { msg: 'Role is required' },
      notEmpty: { msg: 'Role cannot be empty' },
    },
    defaultValue: 'user',
  },
});

module.exports = User;
