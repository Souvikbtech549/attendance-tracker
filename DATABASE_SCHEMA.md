# Database Schema

## User

```js
{
  name: String,
  email: String,
  passwordHash: String,
  role: "student" | "admin",
  defaultMinimumCriteria: Number,
  notificationSettings: {
    email: Boolean,
    push: Boolean,
    warningThreshold: Number
  }
}
```

## Subject

```js
{
  user: ObjectId,
  semester: {
    name: String,
    year: Number
  },
  name: String,
  code: String,
  credits: Number,
  totalClasses: Number,
  attendedClasses: Number,
  minimumCriteria: Number,
  computed: {
    attendancePercentage: Number,
    safeMissCount: Number,
    requiredClassesToRecover: Number,
    warningLevel: "safe" | "warning" | "danger"
  }
}
```

## AttendanceLog

```js
{
  user: ObjectId,
  subject: ObjectId,
  status: "attended" | "missed" | "cancelled",
  date: Date,
  note: String
}
```

## Semester

```js
{
  user: ObjectId,
  name: String,
  startDate: Date,
  endDate: Date,
  gpa: Number,
  isActive: Boolean
}
```

## TimetableEntry

```js
{
  user: ObjectId,
  subject: ObjectId,
  dayOfWeek: Number,
  startTime: String,
  endTime: String,
  room: String
}
```

`dayOfWeek` uses JavaScript day numbers:

```txt
0 Sunday, 1 Monday, 2 Tuesday, 3 Wednesday, 4 Thursday, 5 Friday, 6 Saturday
```
