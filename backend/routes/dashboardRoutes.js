const express = require("express");

const { getStats } = require("../controllers/dashboard/getStats");

const router = express.Router();

router.get("/stats", getStats);

module.exports = router;
