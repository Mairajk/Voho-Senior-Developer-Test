const express = require("express");

const {
  getTenantBySubdomain,
} = require("../controllers/tenant/getTenantBySubdomain");

const router = express.Router();

router.get("/:subdomain", getTenantBySubdomain);

module.exports = router;
