
## **Student Portal 🎓**

A MERN stack application that allows students to send enrollment requests, which are approved first by the course instructor and then by a faculty advisor. The project includes OTP-based login via Gmail for authentication.

## **🚀 Features**

✅ Student Enrollment System – Students can request to enroll in courses.

✅ Approval Workflow – Requests require approval from both the course instructor and the faculty advisor.

✅ OTP-Based Login – Secure authentication using Gmail OTP verification.

✅ Strict Role-Based Access 

   -Only designated users can log in as Instructors and Faculty Advisors.
     
   -Only students with a valid IIT Ropar email ID can register as students.
     
✅ Course Management – Instructors can add new courses.

✅ Course Visibility – Students can view available courses and track the status of their enrollment requests.

✅ Modern UI – Built with React.js, offering a clean and responsive interface.

## **🛠️ Tech Stack**

Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

## **Authentication**: 

OTP-based login via Gmail

## **Deployment** (on vercel):

This project has been deployed on vercel (https://aims-portal-nine.vercel.app)


## **📦 Installation**

1️⃣ Clone the Repository

git clone https://github.com/arnavb2004/Student_portal

cd Student_portal

2️⃣ Install Dependencies

For Backend

cd backend

npm install

For Frontend

cd frontend

npm install

3️⃣ Set Up Environment Variables

Create a .env file in the backend directory with the required credentials:

Backend (.env)

MONGO_URI=your_mongodb_connection_string

EMAIL_USER=your_gmail

EMAIL_PASS=your_gmail_password

4️⃣ Run the Project

Start Backend

cd backend

nodemon server.js

Start Frontend

cd frontend

npm start
