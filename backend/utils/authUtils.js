/* utils/authUtils.js */
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, tenantId: user.tenantId, roleId: user.roleId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // 1 hour expiration
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, tenantId: user.tenantId, roleId: user.roleId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // 7 days expiration
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
