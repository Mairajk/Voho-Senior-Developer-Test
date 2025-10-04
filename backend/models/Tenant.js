const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/sequelize"); // sequelize instance

const Tenant = sequelize.define("tenants", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
  },
  primaryColor: {
    type: DataTypes.STRING,
  },
  subdomain: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

module.exports = Tenant;
