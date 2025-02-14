const Course = require('../models/courseModel');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses
    //const courses = await Course.find();
    console.log('Fetched Courses:',courses);
    //res.status(200).json(courses);

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Add a course
const addCourse = async (req, res) => {
  const { courseId, instructor } = req.body; // Include instructor field
  console.log(req.body);

  try {
    // Check if the courseId already exists
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course ID already exists' });
    }

    // Create and save the course with courseId and instructor
    const course = new Course({ courseId, instructor });
    //console.log('Before saving:', course);
    //console.log(courseId);
    await course.save();
    //console.log('After saving:', course);

    res.status(201).json({ message: 'Course added successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course' });
  }
};

// Get courses by instructor
const getCoursesByInstructor = async (req, res) => {
  const { instructor } = req.params; // Fetch instructor from route parameters
  try {
    const courses = await Course.find({ instructor }); // Fetch courses assigned to the instructor
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses for instructor' });
  }
};

module.exports = { getAllCourses, addCourse, getCoursesByInstructor };
