const crypto = require("crypto");
const { pool } = require("../config/database");
const { ApiError } = require("../utils/apiError");
const { asyncHandler } = require("../utils/asyncHandler");
const { mapRoutineEntry } = require("../utils/sqlMappers");

const routineSelect = `
  SELECT
    t.*,
    s.id AS subject_id,
    s.name AS subject_name,
    s.code AS subject_code,
    s.semester_name,
    s.semester_year,
    s.minimum_criteria
  FROM timetable_entries t
  JOIN subjects s ON s.id = t.subject_id
`;

const listRoutine = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `${routineSelect}
     WHERE t.user_id = $1
     ORDER BY t.day_of_week ASC, t.start_time ASC`,
    [req.user.id]
  );

  res.json({ entries: result.rows.map(mapRoutineEntry) });
});

const createRoutineEntry = asyncHandler(async (req, res) => {
  const subject = await pool.query("SELECT id FROM subjects WHERE id = $1 AND user_id = $2", [req.body.subject, req.user.id]);
  if (!subject.rowCount) throw new ApiError(404, "Subject not found");

  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO timetable_entries (id, user_id, subject_id, day_of_week, start_time, end_time, room)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, req.user.id, req.body.subject, req.body.dayOfWeek, req.body.startTime, req.body.endTime, req.body.room || ""]
  );

  const result = await pool.query(`${routineSelect} WHERE t.id = $1 AND t.user_id = $2`, [id, req.user.id]);
  res.status(201).json({ entry: mapRoutineEntry(result.rows[0]) });
});

const updateRoutineEntry = asyncHandler(async (req, res) => {
  const existing = await pool.query("SELECT * FROM timetable_entries WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
  if (!existing.rowCount) throw new ApiError(404, "Routine entry not found");

  const current = existing.rows[0];

  if (req.body.subject) {
    const subject = await pool.query("SELECT id FROM subjects WHERE id = $1 AND user_id = $2", [req.body.subject, req.user.id]);
    if (!subject.rowCount) throw new ApiError(404, "Subject not found");
  }

  await pool.query(
    `UPDATE timetable_entries
     SET subject_id = $1,
         day_of_week = $2,
         start_time = $3,
         end_time = $4,
         room = $5,
         updated_at = NOW()
     WHERE id = $6 AND user_id = $7`,
    [
      req.body.subject || current.subject_id,
      req.body.dayOfWeek ?? current.day_of_week,
      req.body.startTime || current.start_time,
      req.body.endTime || current.end_time,
      req.body.room ?? current.room,
      req.params.id,
      req.user.id,
    ]
  );

  const result = await pool.query(`${routineSelect} WHERE t.id = $1 AND t.user_id = $2`, [req.params.id, req.user.id]);
  res.json({ entry: mapRoutineEntry(result.rows[0]) });
});

const deleteRoutineEntry = asyncHandler(async (req, res) => {
  const result = await pool.query("DELETE FROM timetable_entries WHERE id = $1 AND user_id = $2 RETURNING id", [req.params.id, req.user.id]);
  if (!result.rowCount) throw new ApiError(404, "Routine entry not found");

  res.json({ ok: true });
});

module.exports = {
  listRoutine,
  createRoutineEntry,
  updateRoutineEntry,
  deleteRoutineEntry,
};
