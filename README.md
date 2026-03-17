# Digital Library System

Production-style full-stack web application for library operations with role-based access, reservation queues, automated fines, and analytics.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, Framer Motion, Recharts, Lucide React
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT
- Scheduler: node-cron

## Project Structure

- backend/: Express API server
- frontend/: React client

## Features

- JWT authentication with Admin and Member roles
- Admin book management: add, update, delete, image upload
- Advanced search with MongoDB text index and filters
- Reservation queue for unavailable books
- Borrow/return transaction flow with overdue tracking
- Automated fine updates via cron schedule
- Admin analytics dashboard with charts and top borrowed books
- Member dashboard with issued books, due dates, reservations, fines
- Responsive, animated UI with sidebar navigation

## Environment Variables

Create backend `.env` from backend/.env.example:

- PORT=5000
- MONGO_URI=mongodb://127.0.0.1:27017/digital_library
- JWT_SECRET=replace_with_strong_secret
- CLIENT_URL=http://localhost:5173
- DAILY_FINE=10
- BORROW_DAYS=14

Create frontend `.env` from frontend/.env.example:

- VITE_API_BASE_URL=http://localhost:5000/api

## Run Locally

1. Install backend dependencies:
   - `cd backend`
   - `npm install`
2. Install frontend dependencies:
   - `cd ../frontend`
   - `npm install`
3. Start backend:
   - `cd ../backend`
   - `npm run dev`
4. Start frontend:
   - `cd ../frontend`
   - `npm run dev`

## Build

- Frontend production build:
  - `cd frontend`
  - `npm run build`

## API Overview

Base URL: `http://localhost:5000/api`

- Auth:
  - POST /auth/signup
  - POST /auth/login
  - GET /auth/me
- Books:
  - GET /books (search, filters, pagination)
  - GET /books/:id
  - POST /books (admin)
  - PUT /books/:id (admin)
  - DELETE /books/:id (admin)
- Transactions:
  - GET /transactions
  - POST /transactions/issue
  - PUT /transactions/:id/return
- Reservations:
  - GET /reservations
  - POST /reservations/:bookId
  - DELETE /reservations/:id
- Dashboard:
  - GET /dashboard/admin (admin)

## Notes

- Fine cron runs hourly and updates issued/overdue transaction fines.
- Returning a book auto-assigns it to the first user in the active reservation queue.
- Email reminders and recommendation engine are not enabled by default in this version.
