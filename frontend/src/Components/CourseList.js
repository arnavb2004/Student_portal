import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseList = ({ studentEmail }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the list of courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data); // Assuming API returns an array of courses
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Available Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.id} ({course.instructor})
            <button onClick={() => enrollInCourse(course.id)}>Request Enrollment</button>
          </li>
        ))}
      </ul>
    </div>
  );

  // Enrollment function
  const enrollInCourse = async (courseId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/enroll', {
        studentEmail,
        courseId,
        
      });
      alert(response.data.message);
    } catch (err) {
      alert('Failed to request enrollment');
    }
  };
};

export default CourseList;
