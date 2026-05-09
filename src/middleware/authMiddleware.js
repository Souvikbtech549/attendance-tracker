const { findUserById } = require("../models/userModel");
const { verifyToken } = require("../utils/security");
const { sendError } = require("../utils/httpResponse");

async function requireUser(req, res) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const payload = verifyToken(token);

  if (!payload) {
    sendError(res, 401, "Please log in again.");
    return null;
  }

  const user = await findUserById(payload.userId);

  if (!user) {
    sendError(res, 401, "Please log in again.");
    return null;
  }

  return user;
}

module.exports = { requireUser };
