# JobSite - Backend

This is the backend of **JobSite**, a job portal where applicants can apply for jobs and recruiters can manage listings and companies. Built with **Express.js** and **MongoDB**, this backend handles authentication, user roles, applications, and profile management.

---

## 🧑‍💼 User Roles

### 👤 Applicant
- Can view all job listings (even without logging in)
- After logging in:
  - Apply to jobs
  - Track the status of their applications (Pending / Accepted / Rejected)
  - Update their profile (name, email, phone number, resume, profile photo, skills, and bio)

### 🧑‍💼 Recruiter
- Create, update, and delete companies
- Can only post jobs after creating a company
- Can only delete a company if all related jobs are deleted first
- Create, update, and delete job listings
- View applicants and their details (name, email, resume, etc.)
- Update the status of applications (default: Pending ➝ Accepted or Rejected)

---

## 🔐 Authentication & Authorization

- JWT-based authentication using **HTTP-only cookies**
- Tokens are stored in cookies for better security (instead of localStorage)
- All protected routes require a valid token to access
- Role-based authorization is implemented (Applicant vs Recruiter)


## 🧰 Tech Stack

- **Express.js**
- **MongoDB** + Mongoose
- **JWT** (with cookies)
- **Multer** (for file uploads like resumes and profile images)
- **Helmet & CORS** for security
- **Cookie-parser** for parsing JWT from cookies

---

