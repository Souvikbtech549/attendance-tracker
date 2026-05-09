const fs = require("fs/promises");
const path = require("path");
const { PUBLIC_DIR } = require("../config/env");
const { sendError } = require("./httpResponse");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

async function serveStaticFile(res, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = path.normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath);
  const allowedFiles = new Set([
    path.join(PUBLIC_DIR, "index.html"),
    path.join(PUBLIC_DIR, "style.css"),
    path.join(PUBLIC_DIR, "script.js"),
  ]);

  if (!filePath.startsWith(PUBLIC_DIR) || !allowedFiles.has(filePath)) {
    sendError(res, 403, "Forbidden.");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(file);
  } catch {
    sendError(res, 404, "Page not found.");
  }
}

module.exports = { serveStaticFile };
