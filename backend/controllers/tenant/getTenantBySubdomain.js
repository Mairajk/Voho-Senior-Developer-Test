const { TenantModel } = require("../../models");

exports.getTenantBySubdomain = async (req, res) => {
  // getTenantBySubdomain called with params

  try {
    const {
      params: { subdomain },
    } = req;

    // looking up tenant for subdomain

    const tenant = await TenantModel.findOne({
      where: { subdomain },
      raw: true,
    });

    if (!tenant) {
      return res.status(404).send("Tenant not found");
    }

    res.json(tenant);
  } catch (error) {
    res.status(500).send("Server error");
  }
};
