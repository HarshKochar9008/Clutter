const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  // Prefer cookie-based token for better XSS resistance.
  const cookieToken = req.cookies?.token;
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Server misconfiguration; do not leak secret details.
    return res
      .status(500)
      .json({ success: false, message: "Server misconfigured." });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  if (!decoded?.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  const user = await User.findById(decoded.userId).select("_id name email");
  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;
