const { pool } = require("../config/database");
const { publicUser } = require("./authController");
const { asyncHandler } = require("../utils/asyncHandler");
const { mapUser } = require("../utils/sqlMappers");

const updateProfile = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1,
         default_minimum_criteria = $2,
         notification_settings = $3,
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [
      req.body.name ?? req.user.name,
      req.body.defaultMinimumCriteria ?? req.user.defaultMinimumCriteria,
      JSON.stringify(req.body.notificationSettings ?? req.user.notificationSettings),
      req.user.id,
    ]
  );

  res.json({ user: publicUser(mapUser(result.rows[0])) });
});

module.exports = { updateProfile };
