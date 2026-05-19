# Job Portal Application

This is a full-stack job portal project built using React, Node.js, Express, Sequelize, and MySQL.

The project has two types of users:
- Employer
- Job Seeker

Employers can post and manage jobs, while job seekers can browse and apply for jobs.

---

## Tech Stack

### Frontend
- React.js
- Ant Design
- React Router DOM
- Axios
- Vite

### Backend
- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication
- bcrypt

### Database
- MySQL

---

## Main Features

### Authentication
- Register/Login
- JWT authentication
- Protected routes
- Role-based access

### Employer
- Create jobs
- Edit/Delete jobs
- Manage posted jobs
- View applicants

### Job Seeker
- Browse jobs
- Apply for jobs
- View applied jobs
- Profile dashboard

### Other Features
- Dark mode
- Responsive UI
- Search and filters
- Pagination
- Toast notifications

---

## Project Structure

```bash
jobportal/
│
├── client/
├── server/
└── README.md

Frontend Structure
client/src/
├── api/
├── components/
├── context/
├── layouts/
├── pages/
├── routes/
└── utils/

Backend Structure
server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── validators/

Setup Instructions
1. Clone Project
git clone <your-repo-url>
cd jobportal

Backend Setup

Open terminal:
cd server
npm install

Create .env file inside server folder:
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=job_portal
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

Start backend:
npm run dev

Frontend Setup

Open second terminal:
cd client
npm install
npm run dev

Frontend runs on:
http://localhost:5173

Backend runs on:
http://localhost:5000

Database Setup
Open MySQL and create database:
CREATE DATABASE job_portal;

Test Flow
Employer
Register as employer
Login
Create job
Manage jobs
View applicants
Job Seeker
Register as seeker
Login
Browse jobs
Apply for jobs
View applied jobs

