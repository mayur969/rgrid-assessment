# Research Grid

Research Grid is a real-time polling application with a React frontend, an Express API, Socket.IO live vote updates, and MongoDB storage. Users can vote in active polls, while admins can create polls, monitor results, and end polls from a dashboard.

## Features

- Public voting page for active polls
- Admin login with JWT authentication
- Create polls with multiple nominees
- End active polls from the admin dashboard
- Live vote updates with Socket.IO
- MongoDB persistence with Mongoose
- Docker Compose setup for frontend, backend, and database

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, Socket.IO Client
- Backend: Node.js, Express, TypeScript, Mongoose, Socket.IO, JWT, bcrypt
- Database: MongoDB
- DevOps: Docker, Docker Compose, Nginx

## Project Structure

```text
research_grid/
  api/              # Express API and Socket.IO server
  client/           # React + Vite frontend
  docker-compose.yml
```

## Run With Docker Compose

From the project root:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:4173`
- Backend API: `http://localhost:8080/api/v1`
- MongoDB: `localhost:27017`

Default MongoDB credentials from `docker-compose.yml`:

```text
username: admin
password: admin@123
```

MongoDB Compass connection string:

```text
mongodb://admin:admin%40123@localhost:27017/research_grid?authSource=admin
```

## Admin Login

The backend seeds a default admin user on startup if one does not already exist:

```text
username: admin
password: admin123
```

Open the admin login page:

```text
http://localhost:4173/admin/login
```

## Local Development

### Backend

```bash
cd api
cp env.example .env
npm install
npm run dev
```

Example `api/.env`:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/research_grid
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
NODE_ENV=development
```

If you are connecting to the Docker Compose MongoDB from a locally running backend, use:

```env
MONGODB_URI=mongodb://admin:admin%40123@localhost:27017/research_grid?authSource=admin
```

### Frontend

```bash
cd client
cp env.example .env
npm install
npm run dev
```

Example `client/.env`:

```env
VITE_BACKEND_URI=http://localhost:8080/api/v1
```

The Vite dev server usually runs at:

```text
http://localhost:5173
```

## API Routes

Base URL:

```text
/api/v1
```

Available route groups:

- `POST /admin/login` - log in as admin
- `GET /polls` - list polls
- `GET /polls/:id` - get one poll
- `POST /polls` - create a poll, admin token required
- `PATCH /polls/:id/end` - end a poll, admin token required
- `POST /votes` - submit a vote

## Useful Commands

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
npm run dev
```

Docker:

```bash
docker compose up --build
docker compose down
docker compose down -v
```

Use `docker compose down -v` only when you want to remove the MongoDB volume and delete local database data.
