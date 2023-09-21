const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection/connection')
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

module.exports = access_token