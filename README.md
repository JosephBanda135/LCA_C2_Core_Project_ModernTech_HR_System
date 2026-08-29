# ModernTech HR System — Course 2 Core Project

A full-stack HR system I built for ModernTech Solutions. It takes my Course 1 Vue.js frontend
and connects it to a real backend I built with Node.js, Express, and MySQL. Instead of fake data
that resets every time you refresh, everything now gets saved to an actual database — employees,
time-off requests, attendance, and payroll all persist properly.

## Technologies Used

**Backend**

- Node.js + Express
- MySQL (via `mysql2`) — running on port `3307`
- bcrypt — password hashing
- jsonwebtoken (JWT) — token-based authentication
- dotenv — environment variable management
- cors

**Frontend**

- Vue.js 3
- Vite
- Axios
- Bootstrap 5

## Setup Instructions

### Prerequisites

- Node.js installed
- MySQL Server installed and running, configured to accept connections on **port 3307**

### 1. Database Setup

1. Open MySQL and create the database:
   ```sql
   CREATE DATABASE moderntech_hr;
   ```
2. Run my schema script against that database — it creates the `users`, `departments`,
   `employees`, `time_off_requests`, `attendance`, and `payroll` tables.
3. Seed it with some sample data (a department or two, at least one user so you can log in, and
   a few employees) so the app isn't empty when you open it.

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder with the following variables:

```
DB_HOST=localhost
DB_PORT=3307
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=moderntech_hr
JWT_SECRET=your_long_random_secret_string
PORT=5000
```

Start the server:

```bash
node server.js
```

You should see `Server is running on http://localhost:5000` in the terminal, with no MySQL
connection errors.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Open the URL Vite gives you (typically `http://localhost:5173`) in your browser.

**Note:** make sure the backend is running before you open the frontend — every page pulls its
data from the API as soon as it loads, so if the backend isn't up yet, you'll just see empty
pages.

## API Endpoints

All routes below need a valid login token, except `/auth/login` and `/auth/register`. You send
the token as `Authorization: Bearer <token>` on every request. If the token is missing or
expired, you'll get a `401` or `403` back instead of your data.

| Method | Endpoint               | Description                                                 | Input (body)                                                                                                      | Output                                                                                                                                             |
| ------ | ---------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/register`       | Creates a new user account                                  | `{ email, password, role }`                                                                                       | `{ id, email, role }`                                                                                                                              |
| POST   | `/auth/login`          | Logs in and returns a JWT                                   | `{ email, password }`                                                                                             | `{ token, user: { id, email, role } }`                                                                                                             |
| GET    | `/employees`           | Returns all employees, with department name joined in       | —                                                                                                                 | `[ { id, first_name, last_name, email, job_title, department_id, department_name, salary, hourly_rate, hours_worked, phone, hire_date, status } ]` |
| POST   | `/employees`           | Creates a new employee                                      | `{ first_name, last_name, email, job_title, department_id, salary, hourly_rate, hours_worked, phone, hire_date }` | The created employee object, with its new `id`                                                                                                     |
| PUT    | `/employees/:id`       | Updates an existing employee                                | Any of the fields above                                                                                           | The updated employee object                                                                                                                        |
| DELETE | `/employees/:id`       | Deletes an employee                                         | —                                                                                                                 | `{ message, id }`                                                                                                                                  |
| GET    | `/departments`         | Returns all departments                                     | —                                                                                                                 | `[ { id, name, location } ]`                                                                                                                       |
| GET    | `/time-off`            | Returns all time-off requests, with employee name joined in | —                                                                                                                 | `[ { id, employee_id, first_name, last_name, start_date, end_date, reason, status, created_at } ]`                                                 |
| POST   | `/time-off`            | Submits a new time-off request (defaults to `Pending`)      | `{ employee_id, start_date, end_date, reason }`                                                                   | The created request object                                                                                                                         |
| PUT    | `/time-off/:id/status` | Approves or rejects a request                               | `{ status: "Approved" \| "Rejected" }`                                                                            | The updated request object                                                                                                                         |
| GET    | `/attendance`          | Returns all attendance records                              | —                                                                                                                 | `[ { id, employee_id, first_name, last_name, date, status } ]`                                                                                     |
| POST   | `/attendance`          | Records attendance for an employee on a date                | `{ employee_id, date, status: "Present" \| "Absent" }`                                                            | The created attendance record                                                                                                                      |
| GET    | `/payroll`             | Returns all payroll history                                 | —                                                                                                                 | `[ { id, employee_id, first_name, last_name, hourly_rate, hours_worked, pay_period } ]`                                                            |
| POST   | `/payroll`             | Generates a payroll record for an employee                  | `{ employee_id, hourly_rate, hours_worked, pay_period }`                                                          | The created payroll record                                                                                                                         |

**Errors** always come back in the same simple shape, so the frontend always knows what to
expect:

```json
{ "error": "Please provide a valid email address" }
```

## Authentication Approach

For the Node.js stack, I used **bcrypt** for password hashing and **JWT** for authentication.

- Passwords are never saved as plain text. When someone registers, `bcrypt.hash()` scrambles
  their password before it's stored. When they log in, `bcrypt.compare()` checks their password
  against that scrambled version — the real password is never stored anywhere.
- When login is successful, the server creates a JWT (a signed token containing the user's id
  and role) and sends it back. The frontend saves this token and attaches it to every request it
  makes after that.
- A middleware function (`authMiddleware.js`) checks this token on every protected route. If
  there's no token, it returns `401`. If the token is invalid or expired, it returns `403`.

I chose this over PHP-style sessions because JWT doesn't need the server to remember anything
about who's logged in. The token itself holds that information, and it gets sent along with
every request. This made more sense for my project because my frontend (Vue) and backend
(Express) run as two separate apps, not one combined app like a typical PHP session setup would
expect.
