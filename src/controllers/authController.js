const { createUser, findUserByEmail, toPublicUser } = require("../models/userModel");
const { readRequestBody } = require("../utils/bodyParser");
const { sendError, sendJson } = require("../utils/httpResponse");
const { createSessionToken, hashPassword, isPasswordValid } = require("../utils/security");
const { validateAuthInput } = require("../validators/authValidator");
const { requireUser } = require("../middleware/authMiddleware");

function createAuthResponse(user) {
  return {
    token: createSessionToken(user.id),
    user: toPublicUser(user),
  };
}

async function register(req, res) {
  const body = await readRequestBody(req);
  const result = validateAuthInput(body, true);

  if (result.error) {
    sendError(res, 400, result.error);
    return;
  }

  const existingUser = await findUserByEmail(result.value.email);

  if (existingUser) {
    sendError(res, 409, "An account with this email already exists.");
    return;
  }

  const password = hashPassword(result.value.password);
  const user = await createUser({
    name: result.value.name,
    email: result.value.email,
    passwordHash: password.hash,
    salt: password.salt,
  });

  sendJson(res, 201, createAuthResponse(user));
}

async function login(req, res) {
  const body = await readRequestBody(req);
  const result = validateAuthInput(body, false);

  if (result.error) {
    sendError(res, 400, result.error);
    return;
  }

  const user = await findUserByEmail(result.value.email);

  if (!user || !isPasswordValid(result.value.password, user)) {
    sendError(res, 401, "Invalid email or password.");
    return;
  }

  sendJson(res, 200, createAuthResponse(user));
}

async function me(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  sendJson(res, 200, { user: toPublicUser(user) });
}

module.exports = {
  register,
  login,
  me,
};
