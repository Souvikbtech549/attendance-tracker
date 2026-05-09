function validateSubjectInput(input) {
  const name = String(input.name || "").trim();
  const total = Number(input.total);
  const attended = Number(input.attended);
  const minimum = Number(input.minimum);

  if (!name) return { error: "Subject name is required." };
  if (!Number.isInteger(total) || total < 0) return { error: "Total classes must be zero or more." };
  if (!Number.isInteger(attended) || attended < 0) return { error: "Attended classes must be zero or more." };
  if (attended > total) return { error: "Attended classes cannot be more than total classes." };
  if (!Number.isInteger(minimum) || minimum < 1 || minimum > 100) {
    return { error: "Minimum criteria must be between 1 and 100." };
  }

  return { value: { name, total, attended, minimum } };
}

module.exports = { validateSubjectInput };
