import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EnrolledCourses = ({ studentEmail }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/enrollments/studentfind/${studentEmail}`
        );
        
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setMessage('Error loading enrolled courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [studentEmail]);

  const handleDropCourse = async (enrollmentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/enrollments/drop/${enrollmentId}`);
      setEnrolledCourses((prev) =>
        prev.filter((course) => course._id !== enrollmentId)
      );
      setMessage('Course dropped successfully!');
    } catch (error) {
      console.error('Error dropping course:', error);
      setMessage('Error dropping course.');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Enrolled Courses</h2>

      {/* Message Banner */}
      {message && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {message}
          <button
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginLeft: '16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => setMessage('')}
          >
            &times;
          </button>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #3B82F6',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          ></div>
          <p>Loading enrolled courses...</p>
        </div>
      )}

      {/* Enrolled Courses */}
      {!loading && enrolledCourses.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#6B7280' }}>No courses enrolled yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              style={{
                padding: '16px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>
                  <span style={{ fontWeight: '600' }}>Course Name:</span>{' '}
                  {course.courseName || 'N/A'}
                </p>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  <span style={{ fontWeight: '600' }}>Instructor:</span>{' '}
                  {course.instructors || course.instructorEmail}
                </p>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  <span style={{ fontWeight: '600' }}>Status:</span>{' '}
                  {course.status}
                </p>
              </div>
              <button
                style={{
                  backgroundColor: '#FF4D4D',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.2s ease',
                }}
                onClick={() => handleDropCourse(course._id)}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#DC2626')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#FF4D4D')}
              >
                Drop Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
