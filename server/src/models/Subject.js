const mongoose = require("mongoose");
const { buildComputedAttendance } = require("../services/attendanceService");

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    semester: {
      name: { type: String, required: true, default: "Semester 1" },
      year: Number,
    },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    credits: { type: Number, default: 3, min: 0 },
    totalClasses: { type: Number, required: true, min: 0 },
    attendedClasses: { type: Number, required: true, min: 0 },
    minimumCriteria: { type: Number, default: 75, min: 1, max: 100 },
    computed: {
      attendancePercentage: Number,
      safeMissCount: Number,
      requiredClassesToRecover: Number,
      warningLevel: { type: String, enum: ["safe", "warning", "danger"], default: "safe" },
    },
  },
  { timestamps: true }
);

subjectSchema.pre("save", function calculateAttendance(next) {
  this.computed = buildComputedAttendance(this);
  next();
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = { Subject };
