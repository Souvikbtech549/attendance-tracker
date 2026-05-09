# Attendance Tracker Backend

This backend uses only Node.js built-in modules, so there is no install step.

## Run Locally

```cmd
cd /d "C:\Users\sigma\Documents\Codex\2026-05-02\i-want-to-create-an-attendence"
node server.js
```

Open:

```txt
http://localhost:3000
```

## Folder Structure

```txt
src/
  app.js
  config/
    env.js
  controllers/
    authController.js
    subjectController.js
  db/
    jsonStore.js
  middleware/
    authMiddleware.js
  models/
    subjectModel.js
    userModel.js
  routes/
    apiRoutes.js
    authRoutes.js
    subjectRoutes.js
  utils/
    bodyParser.js
    httpResponse.js
    security.js
    staticServer.js
  validators/
    authValidator.js
    subjectValidator.js
```

## API Routes

Auth:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Subjects:

```txt
GET    /api/subjects
POST   /api/subjects
DELETE /api/subjects
PATCH  /api/subjects/:id/attendance
DELETE /api/subjects/:id
```

Protected subject routes require:

```txt
Authorization: Bearer <token>
```

## Data Files

The backend creates these automatically:

```txt
data/users.json
data/subjects.json
```
