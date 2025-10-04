const { DataTypes } = require("sequelize");
const sequelize = require("../configs/sequelize"); // sequelize instance
const User = require("./User");

const OAuthRefreshToken = sequelize.define("oauth_refresh_tokens", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  accessTokenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "oauth_tokens",
      key: "id",
    },
  },
  revokedAt: {
    type: DataTypes.DATE,
  },
  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
});

module.exports = OAuthRefreshToken;
