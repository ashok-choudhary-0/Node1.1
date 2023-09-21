const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection/connection')
const address = sequelize.define("address", {
  user_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(300),
    unique: false,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(150),
    unique: false,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(150),
    unique: false,
    allowNull: false
  },
  pin_code: {
    type: DataTypes.STRING(10),
    unique: false,
    allowNull: false
  },
  phone_no: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    validate: {
      len: { args: [10, 15], msg: "phone number length should be in between 10 to 15" },
      not: { args: ["[a-z]"], msg: "entered character must be either number or +" }
    },
  }
}, {
  tableName: "address",
  timestamps: false
})
module.exports = address