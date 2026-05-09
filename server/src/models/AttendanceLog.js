const mongoose = require("mongoose");

const attendanceLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    status: { type: String, enum: ["attended", "missed", "cancelled"], required: true },
    date: { type: Date, default: Date.now },
    note: String,
  },
  { timestamps: true }
);

const AttendanceLog = mongoose.model("AttendanceLog", attendanceLogSchema);

module.exports = { AttendanceLog };
