# College Absence Manager

Full-stack web app (Express + React + PostgreSQL) to manage university student attendance.

## Requirements
- Docker (recommended) OR Node 20 + PostgreSQL 16 locally

## Quick start (Docker Compose)
1. From repo root:
   ```bash
   docker compose up
   ```

2. Create schema:
   ```bash
   # open a shell in db container
   docker exec -it college_absence_db psql -U postgres -d college_absence

   # then paste database/schema.sql and database/seed.sql
   ```

3. Open:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000/health

## Default Admin
- Email: admin@college.local
- Password: admin123

## API (examples)
- POST /api/auth/login
- Admin:
  - POST /api/users (create teacher)
  - POST /api/classes
  - POST /api/students
  - POST /api/enrollments
  - GET  /api/reports/dashboard
- Teacher:
  - GET  /api/classes
  - POST /api/attendance/mark
  - GET  /api/attendance?class_id=...&date=YYYY-MM-DD
  - GET  /api/attendance/export.csv?class_id=...&from=YYYY-MM-DD&to=YYYY-MM-DD