const mongoose = require("mongoose");

const timetableEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: String,
  },
  { timestamps: true }
);

const TimetableEntry = mongoose.model("TimetableEntry", timetableEntrySchema);

module.exports = { TimetableEntry };
