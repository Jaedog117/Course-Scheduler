# Aurora CS Course Scheduler (M2)

A full-stack app that displays the Aurora CS Developer Track course catalog, tracks which courses a student has completed, and shows which courses are available or locked based on prerequisites.

In M2 the data lives in a **MySQL** database and is served by our own **Node/Express API**. The React app reads and saves everything through that API.

**Course:** CSC3700, Advanced Web Application Development, Fall 2026
**Authors:** Johnny Christiansen & Jaedon Vaughn

## Tech Stack

- React + Vite + Bootstrap + React Router (front end, port 5173)
- Node + Express + mysql2 (API, port 3000)
- MySQL (team database)

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19+ (or v22.12+) and npm
- Access to a MySQL database (credentials from the team credential sheet)

## How to Run

1. **Clone the repo**

   ```bash
   git clone https://github.com/Jaedog117/Course-Scheduler
   cd Course-Scheduler
   ```

2. **Create `server/.env`** from the example and fill in the database credentials (it is not committed to git):

   ```bash
   # Windows (Command Prompt)
   copy server\.env.example server\.env

   # Mac / Linux / PowerShell
   cp server/.env.example server/.env
   ```

   ```
   PORT=3000
   DB_HOST=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Create the tables and load the data.** Run these two scripts against your database, in this order (phpMyAdmin's SQL tab works fine):

   1. `server/sql/schema.sql`
   2. `server/sql/seed.sql`

   Re-running `schema.sql` drops and recreates every table, so it also resets the database.

4. **Start the API** (first terminal; leave it running)

   ```bash
   cd server
   npm install
   npm run dev
   ```

   Check it works: http://localhost:3000/api/courses should return all 10 courses as JSON.

5. **Create the React `.env`** in the project root:

   ```bash
   # Windows (Command Prompt)
   copy .env.example .env

   # Mac / Linux / PowerShell
   cp .env.example .env
   ```

   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

6. **Start the React app** (second terminal, from the project root)

   ```bash
   npm install
   npm run dev
   ```

7. Open **http://localhost:5173** in your browser.

## API

All routes start with `/api` and return JSON. `server/requests.http` has a test for every route and error case.

| Method | Route               | Purpose                                              | Success | Errors   |
| ------ | ------------------- | ---------------------------------------------------- | ------- | -------- |
| GET    | /api/courses        | All courses, each with a `prerequisites` array       | 200     |          |
| GET    | /api/courses/:id    | One course                                           | 200     | 404      |
| POST   | /api/courses        | Create a course and its prerequisite rows            | 201     | 400      |
| PUT    | /api/courses/:id    | Update a course and replace its prerequisites        | 200     | 400, 404 |
| DELETE | /api/courses/:id    | Delete a course                                      | 200     | 404      |
| GET    | /api/completions    | Array of completed course ids                        | 200     |          |
| PUT    | /api/completions    | Replace the completed list (prerequisites enforced)  | 200     | 400      |

M2 has no login: the server uses one hardcoded user (id 1, `student1`) for every request.

## Features

- Course catalog loaded from the Express API with a custom `useFetch` hook
- Loading and error states
- Checkbox to mark courses Completed, enforced by prerequisites (front end **and** server)
- Unchecking a course automatically unchecks every course that depends on it
- Completed / Available / Locked status badges
- Filter: All Courses, Completed Only, Remaining
- Progress summary (X of N completed, available, locked)
- Save button writes progress to the database; reloading the page shows the saved state
- React Router navbar with Home (`/`) and About (`/about`) pages

## Project Structure

```
server/
  sql/schema.sql, seed.sql      Create and load the database
  routes/                       courses.js, completions.js
  util/                         database.js (pool), courseData.js, validateCourse.js
  server.js                     Express app
  requests.http                 API tests (WebStorm HTTP Client)
  .env.example                  Template for server/.env
src/
  components/                   CourseCard, CourseList, NavBar, ProgressSummary
  hooks/useFetch.js             Data fetching hook
  pages/                        HomePage, AboutPage
.env.example                    Template for the React .env
```
