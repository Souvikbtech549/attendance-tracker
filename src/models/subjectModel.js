const crypto = require("crypto");
const { SUBJECTS_FILE } = require("../config/env");
const { readJson, writeJson } = require("../db/jsonStore");

async function getSubjects() {
  return readJson(SUBJECTS_FILE);
}

async function getSubjectsByUser(userId) {
  const subjects = await getSubjects();
  return subjects.filter((subject) => subject.userId === userId);
}

async function createSubject(userId, subjectInput) {
  const subjects = await getSubjects();
  const subject = {
    id: crypto.randomUUID(),
    userId,
    ...subjectInput,
    createdAt: new Date().toISOString(),
  };

  subjects.push(subject);
  await writeJson(SUBJECTS_FILE, subjects);
  return subject;
}

async function updateSubjectAttendance(userId, subjectId, didAttend) {
  const subjects = await getSubjects();
  const subject = subjects.find((item) => item.id === subjectId && item.userId === userId);

  if (!subject) return null;

  subject.total += 1;
  subject.attended += didAttend ? 1 : 0;
  subject.updatedAt = new Date().toISOString();

  await writeJson(SUBJECTS_FILE, subjects);
  return subject;
}

async function deleteSubject(userId, subjectId) {
  const subjects = await getSubjects();
  const nextSubjects = subjects.filter((subject) => subject.id !== subjectId || subject.userId !== userId);

  if (subjects.length === nextSubjects.length) return false;

  await writeJson(SUBJECTS_FILE, nextSubjects);
  return true;
}

async function deleteSubjectsByUser(userId) {
  const subjects = await getSubjects();
  await writeJson(SUBJECTS_FILE, subjects.filter((subject) => subject.userId !== userId));
}

module.exports = {
  getSubjectsByUser,
  createSubject,
  updateSubjectAttendance,
  deleteSubject,
  deleteSubjectsByUser,
};
