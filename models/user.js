const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection/connection')
const address = require("./address")
const user = sequelize.define('user', {
  username: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  confirmPassword: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'roles',
      key: 'id'
    }
  }
}, {
  tableName: "user",
  timestamps: false,
})
user.hasMany(address, { foreignKey: 'user_id' });


module.exports = user;