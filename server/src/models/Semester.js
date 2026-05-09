const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    startDate: Date,
    endDate: Date,
    gpa: { type: Number, min: 0, max: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Semester = mongoose.model("Semester", semesterSchema);

module.exports = { Semester };
