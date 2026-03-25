const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
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

const clerkLogin = asyncHandler(async (req, res) => {
  const { token: clerkToken, email, name } = req.body || {};

  // For same-origin requests, Clerk session token is also available in __session cookie,
  // but we prefer the explicit body token (client sends it from Clerk).
  const tokenFromCookie = req.cookies?.__session;
  const token = clerkToken || tokenFromCookie;

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing Clerk session token." });
  }

  const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
  if (!publicKey) {
    return res
      .status(500)
      .json({ success: false, message: "Server misconfigured: CLERK_PEM_PUBLIC_KEY is missing." });
  }

  // Only enforce `azp` if you explicitly configure it.
  // Using `CLIENT_URL` as a fallback easily breaks local dev when your frontend port changes.
  const allowedParties = process.env.CLERK_AUTHORIZED_PARTIES
    ? process.env.CLERK_AUTHORIZED_PARTIES
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  let decoded;
  try {
    decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid Clerk session token." });
  }

  // If Clerk includes azp, enforce it when we know the allowed parties.
  if (decoded?.azp && allowedParties.length && !allowedParties.includes(decoded.azp)) {
    return res.status(401).json({ success: false, message: "Invalid token azp (authorized party)." });
  }

  // Prefer email/name passed by the client; fall back to token claims when possible.
  const extractedEmail =
    email ||
    decoded?.email ||
    decoded?.primary_email_address ||
    decoded?.email_addresses?.[0]?.emailAddress ||
    decoded?.email_addresses?.[0]?.email;

  if (!extractedEmail) {
    return res
      .status(400)
      .json({ success: false, message: "Could not determine email from Clerk session." });
  }

  const extractedName =
    (name || decoded?.full_name || decoded?.name || decoded?.first_name || decoded?.last_name || "").toString();

  // Ensure we satisfy the Mongoose schema requirements (min length, non-empty).
  const safeName =
    extractedName.trim().length >= 2
      ? extractedName.trim().slice(0, 80)
      : extractedEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").trim().slice(0, 80) || "User";

  const existingUser = await User.findOne({ email: extractedEmail });
  let user = existingUser;

  if (!user) {
    const randomPassword = crypto.randomBytes(24).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    user = await User.create({
      name: safeName,
      email: extractedEmail,
      password: hashedPassword,
    });
  } else if (safeName && user.name !== safeName) {
    user.name = safeName;
    await user.save();
  }

  const tokenForApp = generateToken({ userId: user._id });
  const csrfToken = setAuthCookies(res, tokenForApp);

  res.json({
    success: true,
    data: {
      user: { id: user._id, name: user.name, email: user.email },
      csrfToken,
    },
  });
});

module.exports = {
  register,
  login,
  logout,
  clerkLogin,
};
