import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend URL

// Fetch all courses
export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Request enrollment
export const requestEnrollment = async (studentEmail, courseId) => {
  try {
    const response = await axios.post(`${API_URL}/enrollments/request`, {
      studentEmail,
      courseId,
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting enrollment:', error);
    throw error;
  }
};
