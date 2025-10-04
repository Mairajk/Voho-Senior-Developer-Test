const CallModel = require("./Call");
const RoleModel = require("./Role");
const UserModel = require("./User");
const TenantModel = require("./Tenant");
const OAuthTokenModel = require("./OAuthToken");
const OAuthRefreshTokenModel = require("./OAuthRefreshToken");

const models = {
  CallModel,
  RoleModel,
  UserModel,
  TenantModel,
  OAuthTokenModel,
  OAuthRefreshTokenModel,
};

/* Wire model associations if provided */
for (const key of Object.keys(models)) {
  const model = models[key];
  if (model && typeof model.associate === "function") {
    try {
      model.associate(models);
    } catch (e) {
      console.warn(`Failed to associate model ${key}:`, e.message);
    }
  }
}

module.exports = models;
