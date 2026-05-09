const { z } = require("zod");

const signupSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(6),
});

module.exports = { signupSchema, loginSchema };
