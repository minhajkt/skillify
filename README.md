# Skillify - E-Learning Platform

## Description
Skillify is an online learning platform built using the MERN stack (MongoDB, Express, React, Node.js) with TypeScript.
It offers a variety of courses and tutorials designed to help users acquire new skills and improve their knowledge. 
The platform supports multiple user roles, including students and tutors, with functionalities such as course enrollment, content creation, and profile management.

### Features
- **User Registration & Authentication** (JWT)
- **OTP-based Email Verification** for registration
- **Course Management for Tutors**
- **Student Enrollment** in courses
- - **Wishlist** favourite courses
- - **Messaging** between student and tutor
- **Video call** between student and tutor
- **Admin Panel** managing users, tutors and courses
- **Profile Management** for both students and tutors
- **Forgot Password**

### Tech Stack
- **Frontend :** React, TypeScript, Redux
- **Backend:** Node.js, Express, TypeScript
- **Database :** MongoDB
- **Authentication :** JWT (JSON Web Tokens)
- **Cloud Storage :** Cloudinary (for image, videos and certificate uploads)
- **File Uploads :** Multer (for file management)

### Installation
#### Prerequisites   
- **Nodejs**
- **MongoDB**
- **Cloudinary** for media storage

#### Setup

1. Clone the repository:
```bash
git clone https://github.com/minhajkt/skillify.git
```

2. Install the dependencies:
- #### Backend: 
```bash
cd server
npm install
```
- #### Frontend:
```bash
cd client
npm install
```

3. Run the application:
- #### Backend:
```bash
npm run dev
```
- #### Frontend:
```bash
npm run dev
```
