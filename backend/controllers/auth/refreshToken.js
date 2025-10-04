const { OAuthRefreshTokenModel } = require("../../models");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../../utils/authUtils");

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token provided" });
  }

  try {
    const user = await UserModel.findByPk(decoded.userId);
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const storedToken = await OAuthRefreshTokenModel.findOne({
      where: { userId: user.id, refreshToken },
    });

    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
