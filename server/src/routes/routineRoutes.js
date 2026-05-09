const router = require("express").Router();
const {
  createRoutineEntry,
  deleteRoutineEntry,
  listRoutine,
  updateRoutineEntry,
} = require("../controllers/routineController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { routineEntrySchema, routineUpdateSchema } = require("../validators/routineSchemas");

router.use(protect);
router.get("/", listRoutine);
router.post("/", validate(routineEntrySchema), createRoutineEntry);
router.put("/:id", validate(routineUpdateSchema), updateRoutineEntry);
router.delete("/:id", deleteRoutineEntry);

module.exports = { routineRoutes: router };
