# API Routes

Base URL:

```txt
http://localhost:5000/api
```

## Auth

```txt
POST /auth/signup
POST /auth/login
GET  /auth/me
```

## Subjects

All subject routes require:

```txt
Authorization: Bearer <token>
```

```txt
GET    /subjects
POST   /subjects
PUT    /subjects/:id
DELETE /subjects/:id
POST   /subjects/:id/logs
GET    /subjects/:id/logs
```

## Exports

```txt
GET /exports/csv
GET /exports/pdf
```

## Timetable

```txt
GET    /routine
POST   /routine
PUT    /routine/:id
DELETE /routine/:id
```

## Profile

```txt
PUT /profile
```

## Attendance Logic

Current attendance:

```txt
(attendedClasses / totalClasses) * 100
```

Safe misses:

```txt
attendedClasses / (totalClasses + x) >= minimumCriteria
```

Required recovery classes:

```txt
(attendedClasses + x) / (totalClasses + x) >= minimumCriteria
```
