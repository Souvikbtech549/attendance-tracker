const path = require("path");

const ROOT_DIR = path.join(__dirname, "..", "..");
const PUBLIC_DIR = ROOT_DIR;
const DATA_DIR = path.join(ROOT_DIR, "data");

module.exports = {
  PORT: process.env.PORT || 3000,
  ROOT_DIR,
  PUBLIC_DIR,
  DATA_DIR,
  SUBJECTS_FILE: path.join(DATA_DIR, "subjects.json"),
  USERS_FILE: path.join(DATA_DIR, "users.json"),
  TOKEN_SECRET: process.env.TOKEN_SECRET || "change-this-secret-before-hosting",
  TOKEN_MAX_AGE_SECONDS: 60 * 60 * 24 * 7,
};
