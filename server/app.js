const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin / non-browser requests.
      if (!origin) return callback(null, true)

      // Allow the configured CLIENT_URL (exact origin) plus any local Vite dev port.
      // On Vercel, it's common for CLIENT_URL to be missing or differ by scheme,
      // and we don't want to crash with a 500. When CLIENT_URL is not set, allow.
      const configuredRaw = process.env.CLIENT_URL
      const allowedOrigins = configuredRaw
        ? configuredRaw.split(",").map((s) => s.trim()).filter(Boolean)
        : []

      // When running on Vercel, `VERCEL_URL` is typically like "myapp.vercel.app".
      // Allow that origin automatically to prevent CORS misconfig.
      const vercelUrl = process.env.VERCEL_URL
      if (vercelUrl) {
        allowedOrigins.push(`https://${vercelUrl}`)
        allowedOrigins.push(`http://${vercelUrl}`)
      }

      const isLocalHostPort = /^http:\/\/localhost:\d+$/.test(origin)
      const isAllowed =
        allowedOrigins.length === 0
          ? true // fallback to "allow" when env var isn't configured
          : allowedOrigins.includes(origin) || isLocalHostPort

      if (isAllowed) return callback(null, true)
      return callback(null, false)
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Task API is healthy." });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use(errorMiddleware);

module.exports = app;
