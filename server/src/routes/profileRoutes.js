const router = require("express").Router();
const { updateProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.put("/", updateProfile);

module.exports = { profileRoutes: router };
