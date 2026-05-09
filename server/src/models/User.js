const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    defaultMinimumCriteria: { type: Number, default: 75, min: 1, max: 100 },
    notificationSettings: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      warningThreshold: { type: Number, default: 5 },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
