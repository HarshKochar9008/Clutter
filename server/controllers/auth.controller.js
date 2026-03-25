const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const { generateToken } = require("../services/token.service");

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
  res.status(201).json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email },
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
  res.json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    },
  });
});

module.exports = {
  register,
  login,
};
