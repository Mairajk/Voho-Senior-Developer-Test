exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
};
