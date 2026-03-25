const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const { generateToken } = require("../services/token.service");

const parseExpiresInToMs = (expiresIn) => {
  // Supports simple formats like "7d", "24h", "3600s".
  const fallback = 7 * 24 * 60 * 60 * 1000;
  if (!expiresIn) return fallback;
  const match = /^(\d+)([smhd])$/.exec(expiresIn.toString().trim());
  if (!match) return fallback;

  const value = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return fallback;
  }
};

const setAuthCookies = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  const secure = isProd; // secure cookies only over HTTPS
  const sameSite = "lax";
  const maxAge = parseExpiresInToMs(process.env.JWT_EXPIRES_IN || "7d");

  const csrfToken = crypto.randomBytes(32).toString("hex");

  // httpOnly JWT cookie reduces XSS token theft risk.
  res.cookie("token", token, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge,
    path: "/",
  });

  // CSRF token must be readable by the browser for the double-submit pattern.
  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    secure,
    sameSite,
    maxAge,
    path: "/",
  });

  return csrfToken;
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ success: false, message: "Email already in use." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken({ userId: user._id });
  const csrfToken = setAuthCookies(res, token);

  res.status(201).json({
    success: true,
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      csrfToken,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials." });
  }

  const token = generateToken({ userId: user._id });
  const csrfToken = setAuthCookies(res, token);

  res.json({
    success: true,
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      csrfToken,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
  res.clearCookie("csrfToken", {
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });

  res.json({ success: true, message: "Logged out." });
});

module.exports = {
  register,
  login,
  logout,
};
