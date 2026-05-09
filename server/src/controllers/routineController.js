const { Subject } = require("../models/Subject");
const { TimetableEntry } = require("../models/TimetableEntry");
const { ApiError } = require("../utils/apiError");
const { asyncHandler } = require("../utils/asyncHandler");

const listRoutine = asyncHandler(async (req, res) => {
  const entries = await TimetableEntry.find({ user: req.user._id })
    .populate("subject", "name code semester minimumCriteria")
    .sort({ dayOfWeek: 1, startTime: 1 });

  res.json({ entries });
});

const createRoutineEntry = asyncHandler(async (req, res) => {
  const subject = await Subject.findOne({ _id: req.body.subject, user: req.user._id });
  if (!subject) throw new ApiError(404, "Subject not found");

  const entry = await TimetableEntry.create({
    ...req.body,
    user: req.user._id,
  });

  await entry.populate("subject", "name code semester minimumCriteria");
  res.status(201).json({ entry });
});

const updateRoutineEntry = asyncHandler(async (req, res) => {
  if (req.body.subject) {
    const subject = await Subject.findOne({ _id: req.body.subject, user: req.user._id });
    if (!subject) throw new ApiError(404, "Subject not found");
  }

  const entry = await TimetableEntry.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate("subject", "name code semester minimumCriteria");

  if (!entry) throw new ApiError(404, "Routine entry not found");

  res.json({ entry });
});

const deleteRoutineEntry = asyncHandler(async (req, res) => {
  const entry = await TimetableEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!entry) throw new ApiError(404, "Routine entry not found");

  res.json({ ok: true });
});

module.exports = {
  listRoutine,
  createRoutineEntry,
  updateRoutineEntry,
  deleteRoutineEntry,
};
