const fs = require("fs/promises");
const path = require("path");
const { DATA_DIR } = require("../config/env");

async function ensureJsonFile(filePath) {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

async function readJson(filePath) {
  await ensureJsonFile(filePath);
  const file = await fs.readFile(filePath, "utf8");
  return JSON.parse(file || "[]");
}

async function writeJson(filePath, data) {
  await ensureJsonFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function fileName(filePath) {
  return path.basename(filePath);
}

module.exports = {
  ensureJsonFile,
  readJson,
  writeJson,
  fileName,
};
