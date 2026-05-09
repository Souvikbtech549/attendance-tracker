const router = require("express").Router();
const { exportCsv, exportPdf } = require("../controllers/exportController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/csv", exportCsv);
router.get("/pdf", exportPdf);

module.exports = { exportRoutes: router };
