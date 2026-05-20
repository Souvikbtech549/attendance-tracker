const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { pool } = require("../config/database");
const { ApiError } = require("../utils/apiError");
const { asyncHandler } = require("../utils/asyncHandler");
const { mapUser } = require("../utils/sqlMappers");

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    defaultMinimumCriteria: user.defaultMinimumCriteria,
    notificationSettings: user.notificationSettings,
  };
}

const signup = asyncHandler(async (req, res) => {
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [req.body.email]);
  if (existing.rowCount) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const result = await pool.query(
    `INSERT INTO users (id, name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [crypto.randomUUID(), req.body.name, req.body.email, passwordHash]
  );
  const user = mapUser(result.rows[0]);

  res.status(201).json({ token: createToken(user), user: publicUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
  const user = mapUser(result.rows[0]);
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isValid = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!isValid) throw new ApiError(401, "Invalid email or password");

  res.json({ token: createToken(user), user: publicUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = { signup, login, me, publicUser };
