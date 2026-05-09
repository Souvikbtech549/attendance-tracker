export function attendancePercentage(attended, total) {
  if (!total) return 0;
  return (attended / total) * 100;
}

export function safeMissCount(attended, total, minimumCriteria = 75) {
  const current = attendancePercentage(attended, total);
  if (current < minimumCriteria || minimumCriteria <= 0) return 0;

  return Math.max(0, Math.floor(((100 * attended) - (minimumCriteria * total)) / minimumCriteria));
}

export function requiredClassesToRecover(attended, total, minimumCriteria = 75) {
  const current = attendancePercentage(attended, total);
  if (current >= minimumCriteria) return 0;
  if (minimumCriteria >= 100) return Number.POSITIVE_INFINITY;

  return Math.ceil(((minimumCriteria * total) - (100 * attended)) / (100 - minimumCriteria));
}

export function attendanceStatus(attended, total, minimumCriteria = 75) {
  const percentage = attendancePercentage(attended, total);

  if (percentage < minimumCriteria) return "danger";
  if (percentage - minimumCriteria < 5) return "warning";
  return "safe";
}

export function enrichSubject(subject) {
  const percentage = attendancePercentage(subject.attendedClasses, subject.totalClasses);

  return {
    ...subject,
    percentage,
    safeMisses: safeMissCount(subject.attendedClasses, subject.totalClasses, subject.minimumCriteria),
    requiredClasses: requiredClassesToRecover(subject.attendedClasses, subject.totalClasses, subject.minimumCriteria),
    status: attendanceStatus(subject.attendedClasses, subject.totalClasses, subject.minimumCriteria),
  };
}
