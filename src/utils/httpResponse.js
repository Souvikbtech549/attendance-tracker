function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

module.exports = {
  sendJson,
  sendError,
};
