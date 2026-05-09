const PDFDocument = require("pdfkit");
const { stringify } = require("csv-stringify/sync");
const { Subject } = require("../models/Subject");
const { asyncHandler } = require("../utils/asyncHandler");

async function getExportRows(userId) {
  const subjects = await Subject.find({ user: userId }).sort({ "semester.name": 1, name: 1 });
  return subjects.map((subject) => ({
    semester: subject.semester.name,
    subject: subject.name,
    code: subject.code || "",
    totalClasses: subject.totalClasses,
    attendedClasses: subject.attendedClasses,
    minimumCriteria: subject.minimumCriteria,
    attendancePercentage: subject.computed.attendancePercentage,
    safeMissCount: subject.computed.safeMissCount,
    requiredClassesToRecover: subject.computed.requiredClassesToRecover,
    warningLevel: subject.computed.warningLevel,
  }));
}

const exportCsv = asyncHandler(async (req, res) => {
  const rows = await getExportRows(req.user._id);
  const csv = stringify(rows, { header: true });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=attendance-report.csv");
  res.send(csv);
});

const exportPdf = asyncHandler(async (req, res) => {
  const rows = await getExportRows(req.user._id);
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=attendance-report.pdf");
  doc.pipe(res);

  doc.fontSize(20).text("Attendance Report", { underline: true });
  doc.moveDown();

  rows.forEach((row) => {
    doc.fontSize(12).text(`${row.subject} (${row.semester})`);
    doc.fontSize(10).text(`Attendance: ${row.attendancePercentage}% | Safe misses: ${row.safeMissCount} | Need: ${row.requiredClassesToRecover}`);
    doc.moveDown(0.6);
  });

  doc.end();
});

module.exports = { exportCsv, exportPdf };
