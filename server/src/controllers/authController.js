const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { User } = require("../models/User");
const { ApiError } = require("../utils/apiError");
const { asyncHandler } = require("../utils/asyncHandler");

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    defaultMinimumCriteria: user.defaultMinimumCriteria,
    notificationSettings: user.notificationSettings,
  };
}

const signup = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, passwordHash });

  res.status(201).json({ token: createToken(user), user: publicUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isValid = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!isValid) throw new ApiError(401, "Invalid email or password");

  res.json({ token: createToken(user), user: publicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = { signup, login, me, publicUser };
