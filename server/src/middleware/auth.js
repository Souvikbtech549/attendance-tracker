const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { User } = require("../models/User");
const { ApiError } = require("../utils/apiError");
const { asyncHandler } = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw new ApiError(401, "Authentication required");

  const payload = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(payload.id);

  if (!user) throw new ApiError(401, "Invalid session");

  req.user = user;
  next();
});

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission for this action");
    }

    next();
  };
}

module.exports = { protect, allowRoles };
