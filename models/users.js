const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection/connection')
const users = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  confirmPassword: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'roles',
      key: 'id'
    },
    unique: true
  }
}, {
  tableName: "user",
  timestamps: false,
})




module.exports = users;