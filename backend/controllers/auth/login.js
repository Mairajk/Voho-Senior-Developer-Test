const bcrypt = require("bcryptjs");
const {
  UserModel,
  OAuthTokenModel,
  OAuthRefreshTokenModel,
} = require("../../models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/authUtils");

/**
 * login controller
 * - Authenticates a tenant user, creates token records, and sets auth cookies.
 */
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const { id: tenantId } = req.tenant;

  try {
    const user = await UserModel.findOne({
      where: { email, tenantId },
      raw: true,
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const oauthToken = await OAuthTokenModel.create({
      userId: user.id,
      revokedAt: null,
      expiresAt: null,
    });

    await OAuthRefreshTokenModel.create({
      userId: user.id,
      accessTokenId: oauthToken.id,
      refreshToken,
    });

    const isProd = process.env.NODE_ENV === "production";
    const cookieDomain = process.env.COOKIE_DOMAIN || null;

    const accessCookieOptions = {
      httpOnly: isProd,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 3600 * 1000,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
    const refreshCookieOptions = {
      httpOnly: isProd,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };

    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
