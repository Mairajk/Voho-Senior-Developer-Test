const { CallModel, UserModel } = require("../../models");

exports.getStats = async (req, res) => {
  // getStats called with authenticated user and tenant

  try {
    // entering stats retrieval

    const {
      tenant: { id: tenantId },
      user: { id: userId, roleTitle },
    } = req;

    // tenantId, userId and roleTitle are available

    const where = { tenantId };

    if (roleTitle !== "admin") {
      where.userId = userId;
    }

    const activeUserCounts = await UserModel.count({
      where: { tenantId, status: "active" },
      raw: true,
    });

    const callCounts = await CallModel.count({
      where,
      raw: true,
    });

    res.status(200).json({
      activeUserCounts,
      callCounts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error." });
  }
};
