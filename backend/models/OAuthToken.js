const { DataTypes } = require("sequelize");
const sequelize = require("../configs/sequelize"); // sequelize instance
const User = require("./User");

const OAuthToken = sequelize.define("oauth_tokens", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  scopes: {
    type: DataTypes.JSON,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  revokedAt: {
    type: DataTypes.DATE,
  },
  expiresAt: {
    type: DataTypes.DATE,
  },
});

module.exports = OAuthToken;
