const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');

// Request enrollment
const requestEnrollment = async (req, res) => {
  const { studentEmail, courseId } = req.body;
  console.log('wtf' , courseId);
  try {
    // Fetch the course to get instructor email
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      studentEmail,
      courseId,
      courseName : course.courseId,
      instructorEmail: course.instructor, // Assuming 'instructor' holds the email in Course model
      status: 'Instructor Approval Pending',
    });

    await enrollment.save();
    //console.log(enrollment);
    res.status(201).json({ message: 'Enrollment requested successfully', enrollment });
  } catch (error) {
    console.error('Error requesting enrollment:', error);
    res.status(500).json({ message: 'Error requesting enrollment', error });
  }
};


// Approve enrollment by instructor
const approveByInstructor = async (req, res) => {
  const { enrollmentId } = req.body;
  console.log('fuckkkkkkkkkk' ,enrollmentId);
  try {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment || enrollment.status !== 'Instructor Approval Pending') {
      return res.status(400).json({ message: 'Invalid enrollment or already processed' });
    }
    enrollment.status = 'Faculty Advisor Approval Pending';
    await enrollment.save();
    res.status(200).json({ message: 'Enrollment approved by instructor', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error approving enrollment', error });
  }
};

// Approve enrollment by advisor
const approveByAdvisor = async (req, res) => {
  const { enrollmentId } = req.body;
  try {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment || enrollment.status !== 'Faculty Advisor Approval Pending') {
      return res.status(400).json({ message: 'Invalid enrollment or not instructor-approved' });
    }
    enrollment.status = 'Enrolled';
    await enrollment.save();
    res.status(200).json({ message: 'Enrollment approved by advisor', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Error approving enrollment', error });
  }
};

// Fetch enrolled courses for a student
const getEnrolledCourses = async (req, res) => {
  const { studentEmail } = req.query;
  try {
    //const enrolledCourses = await Enrollments.find({ studentEmail }).select('courseId');
    const enrollments = await Enrollment.find({ studentEmail });
    // const enrolledCourses = enrollments.map((enrollment) => ({
    //   studentEmail: enrollment.studentEmail,
    //   instructor: enrollment.instructorEmail,
    //   //credits: enrollment.courseId.credits,
    // }));
    console.log('fuckkk', enrollments);
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error });
  }
};

// Fetch available courses for a student
const getAvailableCourses = async (req, res) => {
  const { studentEmail } = req.query;
  try {
    const enrollments = await Enrollment.find({ studentEmail });
    const enrolledCourseIds = enrollments.map((enrollment) => enrollment.courseId.toString());
    const availableCourses = await Course.find({ _id: { $nin: enrolledCourseIds } });
    res.status(200).json(availableCourses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available courses', error });
  }
};

module.exports = { 
  requestEnrollment, 
  approveByInstructor, 
  approveByAdvisor, 
  getEnrolledCourses, 
  getAvailableCourses 
};
