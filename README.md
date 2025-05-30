# Overview

A full-stack YouTube clone built using the MERN stack (MongoDB, Express.js, React, Node.js) with Tailwind CSS and Vite. The application allows users to view, upload,search functionality, like/dislike, comment on videos, and manage their channels.

---

## Git Repositories

- [Backend Github Repo]()

---

## Live Link for Frontend and backend

- [live link frontend]()
- [live link backend]()

---

## 📁 Folder Structure

```
youtube_clone_backend
├── controller/    # Business logic
├── Middleware/    # Upload & auth middleware
├── Models/        # Mongoose models
├── Routes/        # REST API routes
├── .env
├── server.js
```

---

# Features

**Backend (Node.js, Express, MongoDB)**

- **User Authentication**: Signup, Login, and Token-based Authentication using JWT.

- **Video Management**: API to Upload, fetch, edit, and delete videos.

- **Channel Management**: API to create, fetch, update, and delete channels.

- **Comment Management**: API to add, edit, and delete comments on videos.

# Technologies Used

- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT(JSON Web Token)

# Installation & Setup

**Prerequisites**
Ensure you have the foloowing installed:

- Node.js
- MongoDB

1. Clone the repository:

   - git clone

2. Navigate to the project directory:

   - cd Project Name

3. Set Up Backend
   _ cd NodeJS
   _ npm install
   _ Create a .env file in the NodeJS/ directory an add:
   PORT= 9000
   MONGO_URI=mongodb://127.0.0.1:27017/Youtube_clone
   JWT_SECRET=supersecretjwtkey123
   _ npm start

4. Set Up Frontend

   - cd vite-project
   - npm install
   - npm run dev

5. Open the application in your browser.

6. Register/Login and start using the YouTube clone!
