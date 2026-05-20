# Database Schema

The production backend now uses PostgreSQL. Recommended free providers:

- Supabase Postgres
- Neon Postgres

## users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  default_minimum_criteria INTEGER NOT NULL DEFAULT 75,
  notification_settings JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## subjects

```sql
CREATE TABLE subjects (
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
```

## attendance_logs

```sql
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## timetable_entries

```sql
CREATE TABLE timetable_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  room TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

`day_of_week` uses JavaScript day numbers:

```txt
0 Sunday, 1 Monday, 2 Tuesday, 3 Wednesday, 4 Thursday, 5 Friday, 6 Saturday
```
