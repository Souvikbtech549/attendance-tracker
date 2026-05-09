const { publicUser } = require("./authController");
const { asyncHandler } = require("../utils/asyncHandler");

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "defaultMinimumCriteria", "notificationSettings"];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      req.user[key] = req.body[key];
    }
  }

  await req.user.save();
  res.json({ user: publicUser(req.user) });
});

module.exports = { updateProfile };
