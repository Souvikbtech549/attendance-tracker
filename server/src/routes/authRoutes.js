const router = require("express").Router();
const { login, me, signup } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { loginSchema, signupSchema } = require("../validators/authSchemas");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, me);

module.exports = { authRoutes: router };
