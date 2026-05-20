const PDFDocument = require("pdfkit");
const { stringify } = require("csv-stringify/sync");
const { pool } = require("../config/database");
const { asyncHandler } = require("../utils/asyncHandler");
const { mapSubject } = require("../utils/sqlMappers");

async function getExportRows(userId) {
  const result = await pool.query(
    `SELECT *
     FROM subjects
     WHERE user_id = $1
     ORDER BY semester_name ASC, name ASC`,
    [userId]
  );

  return result.rows.map((row) => {
    const subject = mapSubject(row);

    return {
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
    };
  });
}

const exportCsv = asyncHandler(async (req, res) => {
  const rows = await getExportRows(req.user.id);
  const csv = stringify(rows, { header: true });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=attendance-report.csv");
  res.send(csv);
});

const exportPdf = asyncHandler(async (req, res) => {
  const rows = await getExportRows(req.user.id);
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
