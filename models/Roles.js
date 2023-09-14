const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection/connection')
const Roles = sequelize.define('roles', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false
});
module.exports = Roles