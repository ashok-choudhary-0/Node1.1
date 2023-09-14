const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.dbName, process.env.dbUserName, process.env.dbPassword, {
  host: process.env.host,
  dialect: process.env.database,
  logging: false
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
module.exports = sequelize;
