require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const Course = require('./models/courseModel'); // Ensure correct path
const Enrollments = require('./models/enrollmentModel'); // Ensure correct path
const User=require('./models/userModel');

const app = express();

app.use(
  cors({
    origin: "https://aims-portal-nine.vercel.app",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://aims-portal-nine.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Disable console.log in production
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
}

app.get("/", (req, res) => {
  console.log("Home route accessed");
  res.json({ message: "A simple API" });
});
// app.get("/protected", checkAuth, (req, res) => {
//   console.log("Protected route accessed");
//   res.json({
//     message: "Protected route",
//     user: req.body.user,
//     accessToken: req.body.newaccessToken,
//   });
// });
// Debugging Middleware
/*app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});*/

const users = [
  {
    email: 'aarushdua2004@gmail.com',
    name: 'Aarush Dua',
    role: ['CourseInstructor'],
  },
  {
    email: 'bansalarnav1@gmail.com',
    name: 'Arnav',
    role: ['CourseInstructor'],
  },
  {
    email: 'arnav.020704@gmail.com',
    name: 'Arnav',
    role: ['CourseInstructor','FacultyAdvisor'],
  },
  {
    email: 'duaaarush07@gmail.com',
    name: 'Aarush',
    role: ['FacultyAdvisor'],
  },
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    const User = require('./models/userModel')
    // Clear existing users
    await User.deleteMany({});
    console.log('Existing users deleted.');

    // Insert new users
    await User.insertMany(users);
    console.log('New users added.');

    // Close the connection
    //mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
   // mongoose.connection.close();
  }
};

// Execute the seeding function
seedDatabase();
// Routes
app.use('/api', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.post('/api/verify-instructor-advisor', async (req, res) => {
  const { email, role } = req.body;
  console.log('route hit');

  try {
    console.log(`Received email: ${email}`); // Log email
    const user = await User.findOne({ email, role }); // Remove the name field
    if (!user) {
      console.log('User not found in database'); // Log if user is not found
      return res.status(404).json({ exists: false, message: 'Email not found in database for this role.' });
    }

    console.log('User exists:', user); // Log user data if found
    return res.status(200).json({ exists: true, message: 'User verified successfully.' });

  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ exists: false, message: 'Server error' });
  }
});


// POST route to save email and name
app.post('/save-user', async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ message: 'Email and name are required' });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update their name
      user.name = name;
      await user.save();
      return res.status(200).json({ message: 'User updated successfully' });
    } else {
      // If user doesn't exist, create a new one
      user = new User({ email, name });
      await user.save();
      return res.status(200).json({ message: 'User saved successfully' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Backend: Withdraw Request API
// app.delete('/api/withdraw-request', async (req, res) => {
//   const { studentEmail, courseId } = req.body;

//   try {
//     // Delete from Pending Requests or Enrollments Table
//     const result = await PendingRequests.deleteOne({ studentEmail, courseId });

//     if (result.deletedCount > 0) {
//       return res.status(200).json({ message: 'Withdrawal request successful.' });
//     } else {
//       return res.status(404).json({ message: 'No pending request or enrollment found.' });
//     }
//   } catch (error) {
//     console.error('Error processing withdrawal request:', error);
//     res.status(500).json({ message: 'Failed to withdraw from the course.' });
//   }
// });

// Get Enrolled Courses
app.get('/api/enrollments/instructor/:email', async (req, res) => {
  const { email } = req.params;

  try {
    //console.log('Fetching enrollments for instructor:', email);
    
    //console.log(Enrollments);
    const allEnrollments  = await Enrollments.find();
    //console.log(allEnrollments);
    //console.log(allEnrollments.length);
    const enrollmentRequests = await Enrollments.find({
      instructorEmail: email,
      status: { $in: ['Instructor Approval Pending'] }, 
    });
    
    
    //if (!enrollmentRequests.length) {
      //console.log('No enrollment requests found for instructor:', email);
     //}// else {
    //   console.log('Enrollment Requests:', enrollmentRequests);
    // }
    res.status(200).json(enrollmentRequests);
  } catch (error) {
    console.error('Error fetching enrollment requests for instructor:', error);
    res.status(500).json({ error: 'Error fetching enrollment requests' });
  }
});

app.get('/api/enrollments/advisor/:email', async (req, res) => {
  const { email } = req.params;

  try {
    //console.log('Fetching enrollments for instructor:', email);
    
    //console.log(Enrollments);
    const allEnrollments  = await Enrollments.find();
    //console.log(allEnrollments);
    //console.log(allEnrollments.length);
    const enrollmentRequests = await Enrollments.find({
      instructorEmail: email,
      status: { $in: ['Advisor Approval Pending'] }, 
    });
    
    
    //if (!enrollmentRequests.length) {
      //console.log('No enrollment requests found for instructor:', email);
     //}// else {
    //   console.log('Enrollment Requests:', enrollmentRequests);
    // }
    res.status(200).json(enrollmentRequests);
  } catch (error) {
    console.error('Error fetching enrollment requests for instructor:', error);
    res.status(500).json({ error: 'Error fetching enrollment requests' });
  }
});

// Get Available Courses
app.get('/api/available-courses', async (req, res) => {
  const { studentEmail } = req.query; // Extract the query parameter
  //console.log('Received studentEmail:', studentEmail); // Debug log
  try {
    if (!studentEmail) {
      return res.status(400).json({ error: 'Student email is required' });
    }

    // Logic to fetch available courses (update this if needed)
    const enrolledCourses = await Enrollments.find({ studentEmail });
    const enrolledCourseIds = enrolledCourses.map((enrollment) => enrollment.courseId);
    //console.log('enrlled courses requests ' ,enrolledCourses);
    //const co = await Enrollments.find();
//console.log(co);
    const availableCourses = await Course.find({ _id: { $nin: enrolledCourseIds } });
    //console.log('Available Courses:', availableCourses);

    res.status(200).json(availableCourses);
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ error: 'Error fetching available courses' });
  }
});

// Enroll in a Course
app.post('/api/enroll', async (req, res) => {
  const { email, courseId } = req.body;
  //console.log('email', email , 'cid' , courseId);
  try {
    // Fetch the course to get the instructor's email
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const newRequest = new Enrollments({
      studentEmail: email,
      courseId : course.courseId,
      instructor: course.instructor, // Assuming this field exists in the Course model
      status: 'Instructor Approval Pending',
    });
    //console.log('check check ');
    await newRequest.save();
    res.json({ message: 'Enrollment request sent successfully' });
  } catch (error) {
    console.error('Error sending enrollment request:', error);
    res.status(500).json({ error: 'Error sending enrollment request' });
  }
});


// In your server code, add the following route to drop the course

app.delete('/api/enrollments/drop', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the enrollment by ID
    const enrollment = await Enrollments.findById(id);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Check if the enrollment status is still pending for instructor approval
    if (enrollment.status === 'Instructor Approval Pending' || enrollment.status === 'Advisor Approval Pending') {
      // Remove the course from the pending approval list
      await Enrollments.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Enrollment request deleted successfully.' });
    }

    // If the course has been approved or enrolled, simply remove the student from the course
    await Enrollments.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course dropped successfully' });
  } catch (error) {
    console.error('Error dropping course:', error);
    res.status(500).json({ error: 'Error processing drop request' });
  }
});


app.patch('/api/enrollments/approveByInstructor/:_id', async (req, res) => {
  
  const { _id } = req.params;
  try {
    //console.log('Approving enrollment with ID:', _id);
    const existingEnrollment = await Enrollments.findById(_id);

    if (!existingEnrollment) {
      //console.log('No enrollment found with ID:', _id);
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    let updateObject = {};
    let updateInstructor = {};
  if (existingEnrollment.status === 'Instructor Approval Pending') {
    updateObject = { status: 'Advisor Approval Pending' };
    if(existingEnrollment.studentEmail.includes('csb')){
      updateInstructor = {instructorEmail : 'duaaarush07@gmail.com'};
    }
    else{
      updateInstructor = {instructorEmail : 'arnav.020704@gmail.com'};
    }
  }
  else{
    updateObject = { status: 'Enrolled' };
  }

  const updatedEnrollment = await Enrollments.findByIdAndUpdate(
    _id,
    {...updateObject, ...updateInstructor},
    { new: true } // Return the updated document
  );


    if (!updatedEnrollment) {
      //console.log('No enrollment found with ID:', _id);
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    console.log('Enrollment approved:', updatedEnrollment);
    res.status(200).json(updatedEnrollment);
  } catch (error) {
    console.error('Error approving enrollment:', error);
    res.status(500).json({ error: 'Error approving enrollment' });
  }
});

app.patch('/api/enrollments/rejectByInstructor/:_id', async (req, res) => {
  
  const { _id } = req.params;
  try {
    console.log('Approving enrollment with ID:', _id);
    const updatedEnrollment = await Enrollments.findByIdAndUpdate(
      _id,
      { status: 'Rejected' }, // Update the status
      { new: true } // Return the updated document
    );

    if (!updatedEnrollment) {
      console.log('No enrollment found with ID:', _id);
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    //console.log('Enrollment approved:', updatedEnrollment);
    res.status(200).json(updatedEnrollment);
  } catch (error) {
    console.error('Error approving enrollment:', error);
    res.status(500).json({ error: 'Error approving enrollment' });
  }
});

app.get('/api/enrollments/studentfind', async (req, res) => {
  const  studentEmai  = req.params.studentEmail;
  console.log('Received email:', studentEmai);

  try {
    console.log('Fetching enrollments for student:', studentEmai);

    const studentEnrollments = await Enrollments.find({ studentEmail: studentEmai })
      

    if (!studentEnrollments.length) {
      console.log('No enrollments found for student:', email);
      return res.status(404).json({ error: 'No enrollments found' });
    }

    console.log('Student Enrollments:', studentEnrollments);
    res.status(200).json(studentEnrollments);
  } catch (error) {
    console.error('Error fetching enrollments for student:', error);
    res.status(500).json({ error: 'Error fetching enrollments' });
  }
});


const checkStudentAccess = (email) => email.endsWith('@iitrpr.ac.in');

app.post('/login-student', async (req, res) => {
  const { email, password, role } = req.body;

  if (!checkStudentAccess(email)) {
    return res.status(403).json({ error: 'Invalid email domain for student access.' });
  }

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

    

    res.status(200).json({ message: 'Login successful', user: userCredential.user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});



// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
