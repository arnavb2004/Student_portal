const express = require('express');
const router = express.Router();
const { getAllCourses, addCourse, getCoursesByInstructor } = require('../controllers/courseController');

// Route to get all courses
router.get('/', getAllCourses);

// Route to add a course
router.post('/add', addCourse);

// Route to get courses by instructor
router.get('/instructor/:instructor', getCoursesByInstructor);

module.exports = router;
