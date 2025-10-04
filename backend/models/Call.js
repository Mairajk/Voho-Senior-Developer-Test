const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/sequelize");

const Call = sequelize.define("calls", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  tenantId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: "tenants",
      key: "id",
    },
  },
  callId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Call;
