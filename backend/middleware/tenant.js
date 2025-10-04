const { TenantModel } = require("../models");

exports.verifyTenant = async (req, res, next) => {
  const { subdomain } = req.headers; // tenant subdomain

  try {
    const tenant = await TenantModel.findOne({
      where: { subdomain },
      raw: true,
    });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    req.tenant = tenant;
    next();
  } catch (err) {
    next(err);
  }
};
