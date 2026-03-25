# Task Management Web App

A production-style full-stack task management app with authentication, task CRUD, filtering, analytics, and a modern responsive UI.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Project Structure

```txt
client/
  src/
    components/
    pages/
    hooks/
    services/
    context/
    utils/
server/
  controllers/
  models/
  routes/
  middlewares/
  services/
  config/
```

## Features

- JWT authentication (register/login)
- Task CRUD with status, priority, due date
- Debounced search by title
- Filter by status and priority
- Sorting + pagination
- Analytics dashboard with completion chart
- Dark mode toggle
- Toast-based feedback and loading states
- Optimistic UI updates for key task actions

## Setup

### 1) Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies API requests to backend `http://localhost:5000`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/tasks/analytics`

## Notes

- Ensure MongoDB is running locally or update `MONGO_URI`.
- For production, use secure cookie-based auth or stricter token storage strategy and set robust CORS policy.
