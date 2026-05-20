const { Pool } = require("pg");
const { env } = require("./env");

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl.includes("sslmode=require") || env.databaseUrl.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : false,
});

async function connectDatabase() {
  await pool.query("SELECT 1");
  await migrate();
  console.log("PostgreSQL connected");
}

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      default_minimum_criteria INTEGER NOT NULL DEFAULT 75,
      notification_settings JSONB NOT NULL DEFAULT '{"email":true,"push":false,"warningThreshold":5}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      semester_name TEXT NOT NULL DEFAULT 'Semester 1',
      semester_year INTEGER,
      name TEXT NOT NULL,
      code TEXT DEFAULT '',
      credits NUMERIC NOT NULL DEFAULT 3,
      total_classes INTEGER NOT NULL DEFAULT 0,
      attended_classes INTEGER NOT NULL DEFAULT 0,
      minimum_criteria NUMERIC NOT NULL DEFAULT 75,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS attendance_logs (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      status TEXT NOT NULL CHECK (status IN ('attended', 'missed', 'cancelled')),
      note TEXT,
      date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS timetable_entries (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      room TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);
    CREATE INDEX IF NOT EXISTS idx_logs_subject_id ON attendance_logs(subject_id);
    CREATE INDEX IF NOT EXISTS idx_timetable_user_day ON timetable_entries(user_id, day_of_week);
  `);
}

module.exports = { connectDatabase, pool };
