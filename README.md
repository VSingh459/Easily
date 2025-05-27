# Easily — Full Stack Job Application Portal (Learning Project)

**Easily** is a complete full-stack web application that simulates a real-world job portal. It was created as a learning project to understand the end-to-end flow of user authentication, job posting, application handling, resume uploads, and data persistence using JSON files.



---
<img width="960" alt="Screenshot 2025-05-27 182823" src="https://github.com/user-attachments/assets/06534806-bcda-460e-9bed-faa13468d405" />

## 💡 Features


### 👨‍💼 Recruiter
- Register and login securely using modal forms.
- Post jobs via a detailed form with dropdowns for job type and role.
- Select multiple relevant skills with visual limits and highlights.
- View, update, and delete their posted jobs only.
- See a clear UI for job cards with company name, title, skills, and location.

### 👩‍💻 Job Seeker
- Browse all available jobs on the homepage or jobs page.
- View job details and apply using a modal form.
- Upload a resume (PDF only) which is stored in `/public/resume/`.
- Client-side and server-side validations for form data and file upload.

---

## 🛠 Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | HTML, CSS, EJS, JavaScript (Vanilla DOM)         |
| Backend     | Node.js, Express.js                              |
| Styling     | Custom CSS (per-page modular stylesheets)        |
| File Upload | Multer                                           |
| Auth        | express-session                                  |
| Data Store  | Local `.json` files (`jobs.json`, `recruiter.json`, etc.) |

---

## 🗂 Folder Structure
