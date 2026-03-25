const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  const secret = process.env.JWT_SECRET;
  const decoded = jwt.verify(token, secret);
  const user = await User.findById(decoded.userId).select("_id name email");

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;
