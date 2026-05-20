require("dotenv").config();

const required = ["DATABASE_URL", "JWT_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`Missing ${key}. Add it to server/.env before running production.`);
  }
}

const env = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/attendance_tracker",
  jwtSecret: process.env.JWT_SECRET || "dev-only-secret",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

module.exports = { env };
