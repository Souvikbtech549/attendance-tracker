function attendancePercentage(attendedClasses, totalClasses) {
  if (!totalClasses) return 0;
  return (attendedClasses / totalClasses) * 100;
}

function safeMissCount(attendedClasses, totalClasses, minimumCriteria) {
  const current = attendancePercentage(attendedClasses, totalClasses);
  if (current < minimumCriteria) return 0;
  return Math.max(0, Math.floor(((100 * attendedClasses) - (minimumCriteria * totalClasses)) / minimumCriteria));
}

function requiredClassesToRecover(attendedClasses, totalClasses, minimumCriteria) {
  const current = attendancePercentage(attendedClasses, totalClasses);
  if (current >= minimumCriteria) return 0;
  if (minimumCriteria >= 100) return Number.POSITIVE_INFINITY;
  return Math.ceil(((minimumCriteria * totalClasses) - (100 * attendedClasses)) / (100 - minimumCriteria));
}

function buildComputedAttendance(subject) {
  const percentage = attendancePercentage(subject.attendedClasses, subject.totalClasses);
  return {
    attendancePercentage: Number(percentage.toFixed(2)),
    safeMissCount: safeMissCount(subject.attendedClasses, subject.totalClasses, subject.minimumCriteria),
    requiredClassesToRecover: requiredClassesToRecover(subject.attendedClasses, subject.totalClasses, subject.minimumCriteria),
    warningLevel: percentage < subject.minimumCriteria ? "danger" : percentage - subject.minimumCriteria < 5 ? "warning" : "safe",
  };
}

module.exports = {
  attendancePercentage,
  safeMissCount,
  requiredClassesToRecover,
  buildComputedAttendance,
};
