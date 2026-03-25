const express = require("express");
const { register, login, logout } = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema, clerkLoginSchema } = require("../services/validators");
const { clerkLogin } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/clerk", validate(clerkLoginSchema), clerkLogin);
router.post("/logout", logout);

module.exports = router;
