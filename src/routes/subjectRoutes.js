const {
  addSubject,
  clearSubjects,
  listSubjects,
  markAttendance,
  removeSubject,
} = require("../controllers/subjectController");
const { sendError } = require("../utils/httpResponse");

async function handleSubjectRoutes(req, res, url) {
  if (url.pathname === "/api/subjects" && req.method === "GET") {
    await listSubjects(req, res);
    return;
  }

  if (url.pathname === "/api/subjects" && req.method === "POST") {
    await addSubject(req, res);
    return;
  }

  if (url.pathname === "/api/subjects" && req.method === "DELETE") {
    await clearSubjects(req, res);
    return;
  }

  const attendanceMatch = url.pathname.match(/^\/api\/subjects\/([^/]+)\/attendance$/);
  if (attendanceMatch && req.method === "PATCH") {
    await markAttendance(req, res, attendanceMatch[1]);
    return;
  }

  const deleteMatch = url.pathname.match(/^\/api\/subjects\/([^/]+)$/);
  if (deleteMatch && req.method === "DELETE") {
    await removeSubject(req, res, deleteMatch[1]);
    return;
  }

  sendError(res, 404, "Subject route not found.");
}

module.exports = { handleSubjectRoutes };
