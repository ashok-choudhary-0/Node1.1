const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection/connection')
const users = require("./registration")
const roles = sequelize.define('roles', {
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
roles.hasMany(users);

module.exports = roles
