const express = require("express");

/** Import middlewares. */
const tenantMiddleware = require("../middleware/tenant");
const authMiddleware = require("../middleware/auth");

/** Import controllers. */
const { signup } = require("../controllers/auth/signup");
const { login } = require("../controllers/auth/login");
const { getCurrentUser } = require("../controllers/auth/getCurrentUser");
const { refreshToken } = require("../controllers/auth/refreshToken");

const router = express.Router();

/* Public auth routes */
router.post("/signup", signup);
router.post("/login", login);

/* Protected routes */
router.post("/refresh-token", authMiddleware.verifyToken, refreshToken);
router.get("/me", authMiddleware.verifyToken, getCurrentUser);

module.exports = router;
