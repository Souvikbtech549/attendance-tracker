# Attendly Full-Stack Guide

Attendly is a student attendance platform with:

- React + Tailwind + Framer Motion frontend
- Recharts analytics
- Express + PostgreSQL backend
- JWT authentication
- Semester-wise subject storage
- Everyday class timetable
- Attendance formulas calculated by the backend
- CSV and PDF exports
- PWA shell support

## Project Structure

```txt
client/          React frontend
server/          Express + PostgreSQL backend
src/             Legacy no-dependency prototype backend
data/            Legacy JSON storage
```

Use `client/` and `server/` for the full platform.

## Local Setup

Install dependencies:

```cmd
cd /d "C:\Users\sigma\Documents\Codex\2026-05-02\i-want-to-create-an-attendence"
npm.cmd run install:all
```

Create backend environment file:

```cmd
copy server\.env.example server\.env
```

Edit `server\.env` and set:

```txt
DATABASE_URL=postgresql://username:password@host:5432/attendance_tracker?sslmode=require
JWT_SECRET=your_long_secret
CLIENT_URL=http://localhost:5173
```

Run backend:

```cmd
cd server
npm.cmd run dev
```

Run frontend in a second terminal:

```cmd
cd client
npm.cmd run dev
```

Open:

```txt
http://localhost:5173
```

## Production Deployment

Frontend:

- Deploy `client/` to Vercel or Netlify.
- Set `VITE_API_URL=https://your-backend-url.com/api`.

Backend:

- Deploy `server/` to Render or Railway.
- Add environment variables from `server/.env.example`.
- Use Supabase or Neon Postgres for `DATABASE_URL`.

Database:

- Create a free Postgres database on Supabase or Neon.
- Copy the pooled/connection string.
- Put the connection string in `DATABASE_URL`.
