const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection/connection')
const address = require("./address")
const access_token = sequelize.define("access_token", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  access_token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiry: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: "access_token",
  timestamps: false,
})
access_token.hasMany(address);

module.exports = access_token