const { buildComputedAttendance } = require("../services/attendanceService");

function mapUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    defaultMinimumCriteria: row.default_minimum_criteria,
    notificationSettings: row.notification_settings,
  };
}

function mapSubject(row) {
  if (!row) return null;

  const subject = {
    id: row.id,
    _id: row.id,
    user: row.user_id,
    semester: {
      name: row.semester_name,
      year: row.semester_year,
    },
    name: row.name,
    code: row.code,
    credits: Number(row.credits),
    totalClasses: row.total_classes,
    attendedClasses: row.attended_classes,
    minimumCriteria: Number(row.minimum_criteria),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  subject.computed = buildComputedAttendance(subject);
  return subject;
}

function mapRoutineEntry(row) {
  if (!row) return null;

  return {
    id: row.id,
    _id: row.id,
    user: row.user_id,
    subject: {
      id: row.subject_id,
      _id: row.subject_id,
      name: row.subject_name,
      code: row.subject_code,
      minimumCriteria: Number(row.minimum_criteria),
      semester: {
        name: row.semester_name,
        year: row.semester_year,
      },
    },
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    room: row.room,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapLog(row) {
  if (!row) return null;

  return {
    id: row.id,
    _id: row.id,
    user: row.user_id,
    subject: row.subject_id,
    status: row.status,
    note: row.note,
    date: row.date,
    createdAt: row.created_at,
  };
}

module.exports = {
  mapUser,
  mapSubject,
  mapRoutineEntry,
  mapLog,
};
