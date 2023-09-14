const { DataTypes } = require('sequelize');
const sequelize = require('./index')

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    unique: true
  },
  description: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User 