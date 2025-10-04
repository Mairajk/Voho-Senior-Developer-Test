const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/sequelize"); // sequelize instance
const Tenant = require("./Tenant");

const Role = sequelize.define("roles", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tenantId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: "tenants", // Assumes Tenant model exists
      key: "id",
    },
  },
});

/* Define associations (called by models/index) */
Role.associate = function (models) {
  if (models && models.UserModel)
    Role.hasMany(models.UserModel, { foreignKey: "roleId" });
};

module.exports = Role;
