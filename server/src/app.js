const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { env } = require("./config/env");
const { authRoutes } = require("./routes/authRoutes");
const { subjectRoutes } = require("./routes/subjectRoutes");
const { exportRoutes } = require("./routes/exportRoutes");
const { profileRoutes } = require("./routes/profileRoutes");
const { routineRoutes } = require("./routes/routineRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 250 }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "attendance-tracker-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/exports", exportRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/routine", routineRoutes);
app.use(errorHandler);

module.exports = { app };
