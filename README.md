# JobParking 💼🚀

A modern, fully responsive Job Portal application designed for candidates to find their dream careers and recruiters to source top talent. Built using the MERN stack with real-time features and responsive dashboards.

### 🚀 Live Demo & Testing
Experience the platform live at: [job-portal-gray-two.vercel.app](https://job-portal-gray-two.vercel.app/)

---

## 🌟 Key Features

### 👤 For Candidates (Job Seekers)
- **Interactive Dashboard**: Track sent applications, profile views, and interviews.
- **Job Discovery**: Search and filter active jobs by title, company, or location.
- **Profile Management**: Update your name, skills, and upload a resume (stored securely in MongoDB).
- **One-Click Apply**: Submit applications instantly with your saved resume.
- **Notifications**: Stay updated on shortlist and rejection status changes in real-time.

### 🏢 For Recruiters (Employers)
- **Recruiter Dashboard**: Manage posted jobs and view recent applicants.
- **Job Posting Panel**: Post new openings with specific salaries, locations, and required skills.
- **Applicant Management**: Review applicant details, view resumes inline, update application status (Pending, Shortlisted, Rejected), and schedule interviews.
- **Automated Alerts**: Auto-notifies candidates upon status updates.

### 💬 Shared & Core Features
- **Real-Time Messaging**: Built-in chat system using Socket.io to connect recruiters and candidates.
- **Fully Responsive Drawer Sidebar**: Adapts smoothly to mobile and desktop viewports.
- **Secure Authentication**: JWT token-based secure login and registration.
- **Inline Resume Viewer**: Prevent browser caching for instant updates of candidate resumes.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router DOM, React Hot Toast
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Real-time communication**: Socket.io / Socket.io-client
- **File Uploads**: Multer (Memory Storage)

---

## ⚙️ Project Structure

```text
├── backend/          # Node.js + Express API
│   ├── config/       # Database configuration
│   ├── controllers/  # API business logic handlers
│   ├── middleware/   # Authentication & Upload guards
│   ├── models/       # Mongoose Schemas (User, Job, Application, Resume, Message)
│   ├── routes/       # API endpoints definitions
│   └── server.js     # API entry point & Socket.io server
│
└── frontend/         # React + Tailwind SPA
    ├── public/       # Static assets
    └── src/
        ├── components/ # Reusable components (Navbar, DashboardLayout)
        ├── contexts/   # Auth Context
        ├── pages/      # Views (Dashboards, Job search, Chat, Auth forms)
        └── utils/      # Axios & Theme helpers
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed locally.
- MongoDB Atlas account.

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_secret
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔒 Security Best Practices Implemented
- **Environment Variables**: Confidential details (`MONGO_URI`, `JWT_SECRET`) are kept secure in local `.env` files and configured on hosting servers (Render/Vercel).
- **Secure Git History**: Purged historical commits to prevent key leaks. All `.env` configurations are git-ignored.
- **Encrypted Passwords**: Passwords hashed securely using `bcryptjs` before DB insertion.
