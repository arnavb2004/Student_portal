import React, { useState } from 'react';
import axios from 'axios';

const AddCourse = ({ instructor }) => {
  const [courseId, setCourseId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/courses/add', {
        courseId,
        instructor,
      });
      setMessage(response.data.message);
      setCourseId(''); // Clear the input field
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding course');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        Add Course
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Input Field */}
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <label
            htmlFor="courseId"
            style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '8px',
              color: '#333',
            }}
          >
            Course ID:
          </label>
          <input
            id="courseId"
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#007BFF',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007BFF')}
        >
          Add Course
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <p
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: message.includes('Error') ? '#FFE4E6' : '#D1FAE5',
            color: message.includes('Error') ? '#9B1C31' : '#065F46',
            textAlign: 'center',
            fontWeight: '500',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddCourse;
