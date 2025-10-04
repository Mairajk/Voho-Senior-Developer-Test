const express = require("express");

const { makeACall } = require("../controllers/call/makeACall");

const router = express.Router();

router.post("/", makeACall);
module.exports = router;
