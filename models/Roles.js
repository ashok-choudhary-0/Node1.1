const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection/connection')
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