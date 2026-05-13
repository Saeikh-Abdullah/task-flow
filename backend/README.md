# Task-Flow

A personal task management web application built for the Acme AI Fellowship Technical Assessment (C7).

## Tech Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Frontend | React 18 + Vite                |
| Backend  | Node.js + Express 4            |
| Database | SQLite via sql.js (pure JS)    |
| Styling  | Vanilla CSS (no CSS framework) |
| Testing  | Jest + Supertest               |

## Features

**Required:**
- View all tasks with title, status, priority, due date, and creation date
- Add a task (title required, description optional)
- Mark tasks complete or incomplete with one click
- Delete a task with a confirmation prompt
- Edit a task inline
- Input validation on both frontend and backend
- All data persisted in a real SQLite database

**Bonus:**
- Filter tasks — All / Pending / Done
- Due date field with overdue highlighting
- Priority field (Low / Medium / High) with sorting
- 8 backend unit tests (Jest + Supertest)

## Prerequisites

- Node.js v18 or higher — check with `node -v`
- npm v9 or higher — check with `npm -v`

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-flow.git
cd task-flow
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Server starts at **http://localhost:5000**

> No manual database setup needed. The SQLite file is created automatically
> at `backend/data/tasks.db` on first run. The tasks table is also created
> automatically. Nothing to seed or migrate.

### 3. Frontend setup (open a second terminal)

```bash
cd frontend
npm install
npm run dev
```

App opens at **http://localhost:5173**

## Running Tests

```bash
cd backend
npm test
```

8 tests — all should pass.

## Environment Variables

See `backend/.env.example`:

| Variable       | Default               | Description                   |
|----------------|-----------------------|-------------------------------|
| PORT           | 5000                  | Backend server port           |
| DB_PATH        | ./data/tasks.db       | SQLite database file path     |
| CLIENT_ORIGIN  | http://localhost:5173 | Allowed CORS origin           |

## API Endpoints

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| GET    | /api/tasks            | Get all tasks              |
| POST   | /api/tasks            | Create a task              |
| PUT    | /api/tasks/:id        | Update a task              |
| PATCH  | /api/tasks/:id/toggle | Toggle pending/completed   |
| DELETE | /api/tasks/:id        | Delete a task              |
| GET    | /health               | Health check               |

## Project Structure

```
task-flow/
├── backend/
│   ├── src/
│   │   ├── routes/           # Route definitions
│   │   ├── controllers/      # Business logic
│   │   └── models/           # Database (SQLite)
│   ├── tests/                # Jest + Supertest
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # TaskForm, TaskItem, FilterBar
│   │   ├── services/         # API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

## AI Assistance

Built with assistance from Claude (Anthropic). All logic and architecture decisions were reviewed and understood by me. I can explain every part of the code.