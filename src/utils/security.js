const crypto = require("crypto");
const { TOKEN_MAX_AGE_SECONDS, TOKEN_SECRET } = require("../config/env");

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function signToken(payload) {
  const body = base64Url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || !token.includes(".")) return null;

  const [body, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");

  if (Buffer.byteLength(signature) !== Buffer.byteLength(expected)) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.expiresAt < Date.now()) return null;

  return payload;
}

function createSessionToken(userId) {
  return signToken({
    userId,
    expiresAt: Date.now() + TOKEN_MAX_AGE_SECONDS * 1000,
  });
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function isPasswordValid(password, user) {
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(user.passwordHash));
}

module.exports = {
  createSessionToken,
  hashPassword,
  isPasswordValid,
  verifyToken,
};
