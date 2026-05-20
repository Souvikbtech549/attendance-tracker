const crypto = require("crypto");
const { pool } = require("../config/database");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");
const { mapLog, mapSubject } = require("../utils/sqlMappers");

const subjectSelect = `
  SELECT *
  FROM subjects
`;

const listSubjects = asyncHandler(async (req, res) => {
  const result = await pool.query(`${subjectSelect} WHERE user_id = $1 ORDER BY created_at DESC`, [req.user.id]);
  res.json({ subjects: result.rows.map(mapSubject) });
});

const createSubject = asyncHandler(async (req, res) => {
  const semester = req.body.semester || { name: "Semester 1" };
  const result = await pool.query(
    `INSERT INTO subjects (
      id, user_id, semester_name, semester_year, name, code, credits,
      total_classes, attended_classes, minimum_criteria
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      crypto.randomUUID(),
      req.user.id,
      semester.name || "Semester 1",
      semester.year || null,
      req.body.name,
      req.body.code || "",
      req.body.credits || 3,
      req.body.totalClasses,
      req.body.attendedClasses,
      req.body.minimumCriteria || 75,
    ]
  );

  res.status(201).json({ subject: mapSubject(result.rows[0]) });
});

const updateSubject = asyncHandler(async (req, res) => {
  const existing = await pool.query("SELECT * FROM subjects WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
  if (!existing.rowCount) throw new ApiError(404, "Subject not found");

  const current = mapSubject(existing.rows[0]);
  const semester = req.body.semester || current.semester;

  const result = await pool.query(
    `UPDATE subjects
     SET semester_name = $1,
         semester_year = $2,
         name = $3,
         code = $4,
         credits = $5,
         total_classes = $6,
         attended_classes = $7,
         minimum_criteria = $8,
         updated_at = NOW()
     WHERE id = $9 AND user_id = $10
     RETURNING *`,
    [
      semester.name || current.semester.name,
      semester.year || current.semester.year || null,
      req.body.name ?? current.name,
      req.body.code ?? current.code,
      req.body.credits ?? current.credits,
      req.body.totalClasses ?? current.totalClasses,
      req.body.attendedClasses ?? current.attendedClasses,
      req.body.minimumCriteria ?? current.minimumCriteria,
      req.params.id,
      req.user.id,
    ]
  );

  res.json({ subject: mapSubject(result.rows[0]) });
});

const deleteSubject = asyncHandler(async (req, res) => {
  const result = await pool.query("DELETE FROM subjects WHERE id = $1 AND user_id = $2 RETURNING id", [req.params.id, req.user.id]);
  if (!result.rowCount) throw new ApiError(404, "Subject not found");

  res.json({ ok: true });
});

const addAttendanceLog = asyncHandler(async (req, res) => {
  if (!["attended", "missed", "cancelled"].includes(req.body.status)) {
    throw new ApiError(400, "Invalid attendance status");
  }

  const existing = await pool.query("SELECT * FROM subjects WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
  if (!existing.rowCount) throw new ApiError(404, "Subject not found");

  await pool.query(
    `INSERT INTO attendance_logs (id, user_id, subject_id, status, note)
     VALUES ($1, $2, $3, $4, $5)`,
    [crypto.randomUUID(), req.user.id, req.params.id, req.body.status, req.body.note || ""]
  );

  if (req.body.status !== "cancelled") {
    await pool.query(
      `UPDATE subjects
       SET total_classes = total_classes + 1,
           attended_classes = attended_classes + $1,
           updated_at = NOW()
       WHERE id = $2 AND user_id = $3`,
      [req.body.status === "attended" ? 1 : 0, req.params.id, req.user.id]
    );
  }

  const result = await pool.query("SELECT * FROM subjects WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
  res.status(201).json({ subject: mapSubject(result.rows[0]) });
});

const getSubjectLogs = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT *
     FROM attendance_logs
     WHERE user_id = $1 AND subject_id = $2
     ORDER BY date DESC`,
    [req.user.id, req.params.id]
  );

  res.json({ logs: result.rows.map(mapLog) });
});

module.exports = {
  listSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  addAttendanceLog,
  getSubjectLogs,
};
