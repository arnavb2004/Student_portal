import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailableCourses = ({ studentEmail }) => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/available-courses', {
          params: { studentEmail },
        });
        console.log('Available Courses Response:', response.data);
        setAvailableCourses(response.data);
      } catch (error) {
        console.error('Error fetching available courses:', error);
        setMessage('Error loading available courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCourses();
  }, [studentEmail]);

  const handleEnrollmentRequest = async (courseId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/enrollments/request', {
        studentEmail,
        courseId,
      });
      setMessage(response.data.message);
      // Remove the enrolled course from the list
      setAvailableCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.error('Error requesting enrollment:', error);
      setMessage('Failed to request enrollment.');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
        Available Courses
      </h2>

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
      {loading ? (
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
          <p>Loading available courses...</p>
        </div>
      ) : availableCourses.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#6B7280' }}>No courses available for enrollment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {availableCourses.map((course) => (
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
                  <span style={{ fontWeight: '600' }}>Course ID:</span>{' '}
                  {course.courseId || 'N/A'}
                </p>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  <span style={{ fontWeight: '600' }}>Instructor:</span>{' '}
                  {course.instructor || 'Not Assigned'}
                </p>
              </div>
              <button
                style={{
                  backgroundColor: '#10B981',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.2s ease',
                }}
                onClick={() => handleEnrollmentRequest(course._id)}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#059669')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#10B981')}
              >
                Request Enrollment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableCourses;
