const {
  createSubject,
  deleteSubject,
  deleteSubjectsByUser,
  getSubjectsByUser,
  updateSubjectAttendance,
} = require("../models/subjectModel");
const { requireUser } = require("../middleware/authMiddleware");
const { readRequestBody } = require("../utils/bodyParser");
const { sendError, sendJson } = require("../utils/httpResponse");
const { validateSubjectInput } = require("../validators/subjectValidator");

async function listSubjects(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  sendJson(res, 200, await getSubjectsByUser(user.id));
}

async function addSubject(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  const body = await readRequestBody(req);
  const result = validateSubjectInput(body);

  if (result.error) {
    sendError(res, 400, result.error);
    return;
  }

  const subject = await createSubject(user.id, result.value);
  sendJson(res, 201, subject);
}

async function clearSubjects(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;

  await deleteSubjectsByUser(user.id);
  sendJson(res, 200, { ok: true });
}

async function markAttendance(req, res, subjectId) {
  const user = await requireUser(req, res);
  if (!user) return;

  const body = await readRequestBody(req);
  const subject = await updateSubjectAttendance(user.id, subjectId, Boolean(body.didAttend));

  if (!subject) {
    sendError(res, 404, "Subject not found.");
    return;
  }

  sendJson(res, 200, subject);
}

async function removeSubject(req, res, subjectId) {
  const user = await requireUser(req, res);
  if (!user) return;

  const removed = await deleteSubject(user.id, subjectId);

  if (!removed) {
    sendError(res, 404, "Subject not found.");
    return;
  }

  sendJson(res, 200, { ok: true });
}

module.exports = {
  listSubjects,
  addSubject,
  clearSubjects,
  markAttendance,
  removeSubject,
};
