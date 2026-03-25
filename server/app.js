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

      // Allow the configured CLIENT_URL plus any local Vite dev port.
      const configured = process.env.CLIENT_URL
      const isLocalHostPort = /^http:\/\/localhost:\d+$/.test(origin)
      if (configured && origin === configured) return callback(null, true)
      if (isLocalHostPort) return callback(null, true)
      return callback(new Error("Not allowed by CORS"))
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
