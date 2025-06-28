DocSpot – Seamless Appointment Booking for Healthcare

Team Details:
Team ID     : LTVIP2025TMID58841  
Team Size   : 4  
Team Leader : Sri Vaishnavi B  
Team Member : Rv Balaji Sai  
Team Member : Bollam Adarsh  
Team Member : B Arjun Dev

DocSpot is a full-stack doctor appointment booking system built during the SmartInternz 2025 Virtual Internship Program, powered by SmartBridge. This MERN stack project simplifies how patients book appointments while offering robust tools for doctors and admins to manage schedules and services.

Project Overview

DocSpot enhances healthcare accessibility by securely connecting patients with verified doctors. With a clean UI and intuitive workflows, the system supports:
- Role-based access for users, doctors, and administrators
- Real-time appointment availability
- Notification management
- Admin control over doctor verification and system operations

Tech Stack

Frontend:
- React.js
- Redux Toolkit
- TypeScript
- Material UI (MUI)
- React Router DOM
- Formik & Yup

Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt.js

Key Features

User:
- Register & login
- Apply as a doctor
- Book appointments
- View appointment history
- Receive real-time notifications

Doctor:
- Login & manage availability
- View patient appointments
- Update appointment status

Admin:
- Approve or reject doctor applications
- Manage users and doctors

Installation & Setup

1. Clone the Repository:
git clone https://github.com/your-username/docspot.git
cd docspot

2. Backend Setup:
cd server
npm install
npm run dev

3. Frontend Setup:
cd client
npm install
npm start

4. Environment Variables:

Create a .env file inside the server/ directory with the following content:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

Folder Structure

/docspot
├── /client     # React frontend
└── /server     # Express backend

Authentication & Authorization

- JWT-based authentication
- Middleware for protected routes
- Role-based access control: user, doctor, admin

Deployment

The application can be deployed using:
- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas

Acknowledgements

This project is part of the SmartInternz Short-Term Internship 2025, a guided full-stack development learning initiative.

Special thanks to SmartBridge and SmartInternz for the opportunity and mentorship.

Author

Sri Vaishnavi B  
Full Stack Developer Intern – SmartInternz  
LinkedIn | GitHub

License

This project is licensed under the MIT License.
