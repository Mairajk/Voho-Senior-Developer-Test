exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    /* req.user may be a Sequelize instance or token payload */
    const user = req.user;

    const safeUser = {
      id: user.id || user.userId,
      email: user.email || user.userEmail,
      firstName: user.firstName || user.firstName,
      lastName: user.lastName || user.lastName,
      roleTitle: user.roleTitle || (user.role && user.role.name) || null,
    };

    return res.json(safeUser);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
