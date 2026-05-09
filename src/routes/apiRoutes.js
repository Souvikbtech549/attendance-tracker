const { handleAuthRoutes } = require("./authRoutes");
const { handleSubjectRoutes } = require("./subjectRoutes");
const { sendError } = require("../utils/httpResponse");

async function handleApi(req, res, url) {
  if (url.pathname.startsWith("/api/auth/")) {
    await handleAuthRoutes(req, res, url);
    return;
  }

  if (url.pathname.startsWith("/api/subjects")) {
    await handleSubjectRoutes(req, res, url);
    return;
  }

  sendError(res, 404, "API route not found.");
}

module.exports = { handleApi };
