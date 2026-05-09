# Attendly Full-Stack Guide

Attendly is a student attendance platform with:

- React + Tailwind + Framer Motion frontend
- Recharts analytics
- Express + MongoDB backend
- JWT authentication
- Semester-wise subject storage
- Everyday class timetable
- Attendance formulas stored in MongoDB
- CSV and PDF exports
- PWA shell support

## Project Structure

```txt
client/          React frontend
server/          Express + MongoDB backend
src/             Legacy no-dependency prototype backend
data/            Legacy JSON storage
```

Use `client/` and `server/` for the full platform.

## Local Setup

Install dependencies:

```cmd
cd /d "C:\Users\sigma\Documents\Codex\2026-05-02\i-want-to-create-an-attendence"
npm run install:all
```

Create backend environment file:

```cmd
copy server\.env.example server\.env
```

Edit `server\.env` and set:

```txt
MONGODB_URI=mongodb://127.0.0.1:27017/attendance_tracker
JWT_SECRET=your_long_secret
CLIENT_URL=http://localhost:5173
```

Run backend:

```cmd
cd server
npm run dev
```

Run frontend in a second terminal:

```cmd
cd client
npm run dev
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
- Use MongoDB Atlas for `MONGODB_URI`.

Database:

- Create a MongoDB Atlas cluster.
- Add your backend host to network access.
- Create a database user.
- Put the connection string in `MONGODB_URI`.
