const { login, me, register } = require("../controllers/authController");
const { sendError } = require("../utils/httpResponse");

async function handleAuthRoutes(req, res, url) {
  if (url.pathname === "/api/auth/register" && req.method === "POST") {
    await register(req, res);
    return;
  }

  if (url.pathname === "/api/auth/login" && req.method === "POST") {
    await login(req, res);
    return;
  }

  if (url.pathname === "/api/auth/me" && req.method === "GET") {
    await me(req, res);
    return;
  }

  sendError(res, 404, "Auth route not found.");
}

module.exports = { handleAuthRoutes };
