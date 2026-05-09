const router = require("express").Router();
const {
  addAttendanceLog,
  createSubject,
  deleteSubject,
  getSubjectLogs,
  listSubjects,
  updateSubject,
} = require("../controllers/subjectController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { subjectSchema, subjectUpdateSchema } = require("../validators/subjectSchemas");

router.use(protect);
router.get("/", listSubjects);
router.post("/", validate(subjectSchema), createSubject);
router.put("/:id", validate(subjectUpdateSchema), updateSubject);
router.delete("/:id", deleteSubject);
router.post("/:id/logs", addAttendanceLog);
router.get("/:id/logs", getSubjectLogs);

module.exports = { subjectRoutes: router };
