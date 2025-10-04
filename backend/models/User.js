const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/sequelize"); // sequelize instance
const Tenant = require("./Tenant");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: "Roles", // Assumes Role model exists
      key: "id",
    },
  },
  tenantId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: "tenants", // Assumes Tenant model exists
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("pending", "active", "blocked"),
    defaultValue: "pending",
    allowNull: false,
  },
});

/* Define associations (called by models/index) */
User.associate = function (models) {
  if (models && models.RoleModel)
    User.belongsTo(models.RoleModel, { foreignKey: "roleId", as: "role" });
  if (models && models.TenantModel)
    User.belongsTo(models.TenantModel, {
      foreignKey: "tenantId",
      as: "tenant",
    });
};

module.exports = User;
