# DocSpot – Seamless Appointment Booking for Healthcare

## Team Details

- Team ID: LTVIP2025TMID58841  
- Team Size: 4  
- Team Leader: Sri Vaishnavi B  
- Team Members:  
  - Rv Balaji Sai  
  - Bollam Adarsh  
  - B Arjun Dev  

## Project Overview

DocSpot is a full-stack doctor appointment booking system built during the SmartInternz 2025 Virtual Internship Program, powered by SmartBridge.  
This MERN stack project streamlines the appointment process for patients while providing robust tools for doctors and administrators to manage availability, appointments, and user roles.

## Features

### User
- Register and log in
- Apply as a doctor
- Book appointments
- View appointment history
- Receive real-time notifications

### Doctor
- Log in and manage availability
- View scheduled appointments
- Update appointment statuses

### Admin
- Approve or reject doctor applications
- Manage users and doctors
- Oversee platform activity

## Tech Stack

### Frontend
- React.js  
- Redux Toolkit  
- TypeScript  
- Material UI (MUI)  
- React Router DOM  
- Formik & Yup  

### Backend
- Node.js  
- Express.js  
- MongoDB with Mongoose  
- JWT Authentication  
- Bcrypt.js  

## Folder Structure

```

Project Files/
├── client/     # React frontend
└── server/     # Express backend

````

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/srivaishnavi26/DocSpot-Seamless-Appointment-Booking-for-Health.git
cd DocSpot-Seamless-Appointment-Booking-for-Health
````

### 2. Backend Setup

```bash
cd "Project Files/server"
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd "../client"
npm install
npm start
```

### 4. Environment Variables

Create a `.env` file in the `server/` directory with the following content:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Authentication & Authorization

* JWT-based authentication
* Middleware for route protection
* Role-based access control (user, doctor, admin)

## Deployment

* Frontend: Vercel or Netlify
* Backend: Render or Railway
* Database: MongoDB Atlas

## Acknowledgements

This project was developed as part of the SmartInternz Short-Term Internship 2025, a guided full-stack learning program.
Special thanks to SmartBridge and SmartInternz for their support and mentorship.

## Author

Sri Vaishnavi B
Full Stack Developer Intern – SmartInternz
[LinkedIn](www.linkedin.com/in/sri-vaishnavi-bhaskara) | [GitHub](https://github.com/srivaishnavi26)
