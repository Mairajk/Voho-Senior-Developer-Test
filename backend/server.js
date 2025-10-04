const express = require("express");
const app = express();

/** Import Routes. */
const authRoutes = require("./routes/authRoutes");
const callRoutes = require("./routes/callRoutes");
const tenantRoutes = require("./routes/tenantsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

/** Import Middleware. */
const authMiddleware = require("./middleware/auth");
const tenantMiddleware = require("./middleware/tenant");

const cors = require("cors");
const cookieParser = require("cookie-parser");

/**
 * Backend server configuration: CORS
 * - FRONTEND_ORIGINS / FRONTEND_URL (comma-separated) defines allowed origins.
 * - In development we allow convenient localhost variants and optional '*'.
 * - In production be explicit about origins; wildcard '*' is rejected.
 */
const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";
const isDev = !isProd;

// Bind address and port
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const frontendEnv =
  process.env.FRONTEND_ORIGINS ||
  process.env.FRONTEND_URL ||
  "http://localhost:3000";
let allowedOrigins = frontendEnv
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (isDev) {
  const devDefaults = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*.localhost:3000", // allow subdomains like acme.localhost:3000 in dev
  ];
  for (const d of devDefaults)
    if (!allowedOrigins.includes(d)) allowedOrigins.push(d);
}

/**
 * Checks whether a request origin is allowed. Supports:
 * - full origins (https://example.com[:port])
 * - hostnames (example.com)
 * - host:port (example.com:3000)
 * - wildcard subdomains (*.example.com)
 */
function isOriginAllowed(origin) {
  if (!origin) return false; // undefined origin => non-browser client (handled separately)

  // Dev convenience: allow '*' when explicitly configured in dev
  if (allowedOrigins.includes("*") && isDev) return true;

  try {
    const url = new URL(origin);
    const originHost = url.hostname;
    const originPort = url.port || (url.protocol === "https:" ? "443" : "80");

    for (const entry of allowedOrigins) {
      if (!entry) continue;

      // Full origin specified
      if (entry.includes("://")) {
        try {
          const e = new URL(entry);
          if (e.origin === url.origin) return true;
        } catch (e) {
          continue; // malformed entry
        }
        continue;
      }

      // Wildcard subdomain
      if (entry.startsWith("*.")) {
        const base = entry.slice(2); // example.com or example.com:3000
        const [baseHost] = base.split(":");
        if (originHost === baseHost) return true;
        if (originHost.endsWith("." + baseHost)) return true;
        continue;
      }

      // host[:port] or plain host
      const [hostPart, portPart] = entry.split(":");
      if (portPart) {
        if (originHost === hostPart && originPort === portPart) return true;
      } else if (originHost === entry) {
        return true;
      }
    }
  } catch (e) {
    return false; // malformed origin
  }

  return false;
}

// In development we may inspect allowedOrigins via debugging, but avoid noisy logs by default.

// Production safety checks
if (isProd) {
  if (!process.env.JWT_SECRET) {
    console.error(
      "FATAL: JWT_SECRET is not set in production. Aborting startup."
    );
    process.exit(1);
  }

  if (allowedOrigins.length === 0) {
    console.error(
      "FATAL: No FRONTEND_ORIGINS/FRONTEND_URL configured in production. Aborting startup."
    );
    process.exit(1);
  }

  if (allowedOrigins.includes("*")) {
    console.error(
      "FATAL: Wildcard '*' origin is not allowed in production. Set explicit FRONTEND_ORIGINS."
    );
    process.exit(1);
  }
}

// Configure trust proxy when running behind a reverse proxy (e.g., nginx, Heroku)
const TRUST_PROXY = process.env.TRUST_PROXY || false;
if (TRUST_PROXY) {
  app.set(
    "trust proxy",
    TRUST_PROXY === "true" || TRUST_PROXY === "1" ? 1 : TRUST_PROXY
  );
}

// Ensure responses vary by Origin for caching correctness
app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Non-browser or same-origin (e.g., curl, server-to-server) -> allow
      if (!origin) return callback(null, true);

      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      const msg = `CORS policy: origin ${origin} not allowed`;
      return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

/* Parse cookies from incoming requests so middleware can read req.cookies */
app.use(cookieParser());

app.use("/api/auth", tenantMiddleware.verifyTenant, authRoutes);

app.use("/api/tenant", tenantRoutes);

app.use(
  "/api/call",
  tenantMiddleware.verifyTenant,
  authMiddleware.verifyToken,
  callRoutes
);

app.use(
  "/api/dashboard",
  /* Re-enable middleware for security and to provide necessary data to the controller */
  tenantMiddleware.verifyTenant,
  authMiddleware.verifyToken,
  dashboardRoutes
);

app.listen(PORT, HOST, () => {
  // Minimal startup log
  console.log(
    `Backend server running on http://${HOST}:${PORT} (NODE_ENV=${NODE_ENV})`
  );
});
