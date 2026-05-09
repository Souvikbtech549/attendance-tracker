function validateAuthInput(input, isRegister) {
  const name = String(input.name || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");

  if (isRegister && name.length < 2) return { error: "Name must be at least 2 characters." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  return { value: { name, email, password } };
}

module.exports = { validateAuthInput };
