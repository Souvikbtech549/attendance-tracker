const crypto = require("crypto");
const { USERS_FILE } = require("../config/env");
const { readJson, writeJson } = require("../db/jsonStore");

async function getUsers() {
  return readJson(USERS_FILE);
}

async function findUserByEmail(email) {
  const users = await getUsers();
  return users.find((user) => user.email === email) || null;
}

async function findUserById(id) {
  const users = await getUsers();
  return users.find((user) => user.id === id) || null;
}

async function createUser({ name, email, passwordHash, salt }) {
  const users = await getUsers();
  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeJson(USERS_FILE, users);
  return user;
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

module.exports = {
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  toPublicUser,
};
