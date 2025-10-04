const bcrypt = require("bcryptjs");
const {
  UserModel,
  OAuthRefreshTokenModel,
  RoleModel,
  OAuthTokenModel,
} = require("../../models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/authUtils");

/**
 * signup controller
 * - Creates a user for the current tenant and sets auth cookies.
 */
exports.signup = async (req, res) => {
  const { email, password, firstName, lastName, roleId } = req.body;

  try {
    const role = await RoleModel.findOne({
      where: { name: "normal" },
      raw: true,
    });
    if (!role) return res.status(400).json({ message: "Role not found" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      tenantId: req.tenant.id,
      roleId: role.id,
    });

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
    res.cookie("accessToken", accessToken, {
      httpOnly: isProd,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 3600 * 1000,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: isProd,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });

    res.status(201).json({
      message: "UserModel created successfully",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("error in signup:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
