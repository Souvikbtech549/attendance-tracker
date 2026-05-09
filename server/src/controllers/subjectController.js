const { AttendanceLog } = require("../models/AttendanceLog");
const { Subject } = require("../models/Subject");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");

const listSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ subjects });
});

const createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create({ ...req.body, user: req.user._id });
  res.status(201).json({ subject });
});

const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
  if (!subject) throw new ApiError(404, "Subject not found");

  Object.assign(subject, req.body);
  await subject.save();

  res.json({ subject });
});

const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!subject) throw new ApiError(404, "Subject not found");

  await AttendanceLog.deleteMany({ subject: subject._id, user: req.user._id });
  res.json({ ok: true });
});

const addAttendanceLog = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, user: req.user._id });
  if (!subject) throw new ApiError(404, "Subject not found");

  if (!["attended", "missed", "cancelled"].includes(req.body.status)) {
    throw new ApiError(400, "Invalid attendance status");
  }

  await AttendanceLog.create({
    user: req.user._id,
    subject: subject._id,
    status: req.body.status,
    note: req.body.note,
  });

  if (req.body.status !== "cancelled") {
    subject.totalClasses += 1;
    if (req.body.status === "attended") subject.attendedClasses += 1;
    await subject.save();
  }

  res.status(201).json({ subject });
});

const getSubjectLogs = asyncHandler(async (req, res) => {
  const logs = await AttendanceLog.find({ user: req.user._id, subject: req.params.id }).sort({ date: -1 });
  res.json({ logs });
});

module.exports = {
  listSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  addAttendanceLog,
  getSubjectLogs,
};
