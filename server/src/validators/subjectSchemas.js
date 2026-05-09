const { z } = require("zod");

const subjectBaseSchema = z.object({
  name: z.string().trim().min(1),
  code: z.string().trim().optional().default(""),
  credits: z.number().min(0).default(3),
  totalClasses: z.number().int().min(0),
  attendedClasses: z.number().int().min(0),
  minimumCriteria: z.number().min(1).max(100).default(75),
  semester: z.object({
    name: z.string().trim().min(1).default("Semester 1"),
    year: z.number().optional(),
  }).default({ name: "Semester 1" }),
});

const subjectSchema = subjectBaseSchema.refine((data) => data.attendedClasses <= data.totalClasses, {
  message: "Attended classes cannot be more than total classes",
  path: ["attendedClasses"],
});

const subjectUpdateSchema = subjectBaseSchema.partial().refine((data) => {
  if (data.attendedClasses === undefined || data.totalClasses === undefined) return true;
  return data.attendedClasses <= data.totalClasses;
}, {
  message: "Attended classes cannot be more than total classes",
  path: ["attendedClasses"],
});

module.exports = { subjectSchema, subjectUpdateSchema };
