const jwt = require("jsonwebtoken");
const { OAuthRefreshTokenModel, UserModel, RoleModel } = require("../models");
const { generateAccessToken } = require("../utils/authUtils");

/**
 * Verify access token middleware.
 * - Reads tokens from cookies, verifies JWTs, refreshes access token when expired.
 */
exports.verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken && req.headers && req.headers.cookie) {
    // Raw cookie header present but parsed value missing; cookie-parser should populate req.cookies
  }

  if (!accessToken)
    return res.status(403).json({ message: "No access token provided" });

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await UserModel.findByPk(decoded.userId, {
      include: { model: RoleModel, as: "role", attributes: ["id", "name"] },
    });

    req.user = user;
    req.user.roleTitle = user.role.name;
    delete req.user.role;

    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        return res.status(403).json({ message: "No refresh token provided" });

      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.JWT_SECRET
        );

        const storedToken = await OAuthRefreshTokenModel.findOne({
          where: {
            userId: decodedRefreshToken.userId,
            accessTokenId: decodedRefreshToken.accessTokenId,
          },
        });

        if (!storedToken)
          return res.status(403).json({ message: "Invalid refresh token" });

        const user = await UserModel.findByPk(decodedRefreshToken.userId, {
          include: { model: RoleModel, as: "role", attributes: ["id", "name"] },
        });

        const newAccessToken = generateAccessToken(user);

        const isProd = process.env.NODE_ENV === "production";
        const cookieDomain = process.env.COOKIE_DOMAIN || null;
        res.cookie("accessToken", newAccessToken, {
          httpOnly: isProd,
          secure: isProd,
          sameSite: isProd ? "None" : "Lax",
          maxAge: 3600 * 1000,
          ...(cookieDomain ? { domain: cookieDomain } : {}),
        });

        req.user = user;
        req.user.roleTitle = user.role.name;
        delete req.user.role;

        return next();
      } catch (refreshTokenError) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
    }

    return res.status(403).json({ message: "Invalid or expired access token" });
  }
};
