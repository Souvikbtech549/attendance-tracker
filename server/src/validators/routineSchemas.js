const { z } = require("zod");

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const routineBaseSchema = z.object({
  subject: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(timePattern, "Start time must use HH:mm format"),
  endTime: z.string().regex(timePattern, "End time must use HH:mm format"),
  room: z.string().trim().optional().default(""),
});

const routineEntrySchema = routineBaseSchema.refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

const routineUpdateSchema = routineBaseSchema.partial().refine((data) => {
  if (!data.startTime || !data.endTime) return true;
  return data.endTime > data.startTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

module.exports = { routineEntrySchema, routineUpdateSchema };
