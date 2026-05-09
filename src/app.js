const http = require("http");
const { handleApi } = require("./routes/apiRoutes");
const { serveStaticFile } = require("./utils/staticServer");
const { sendError } = require("./utils/httpResponse");

function createApp() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    try {
      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url);
        return;
      }

      await serveStaticFile(res, url);
    } catch (error) {
      sendError(res, 500, error.message || "Server error.");
    }
  });
}

module.exports = { createApp };
