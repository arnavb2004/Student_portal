import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproveRequests = ({ instructor }) => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to fetch requests from the backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/enrollments/instructor/${instructor}`
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [instructor]);

  // Handle course approval
  const handleApprove = async (_id) => {
    try {
      const response = await axios.patch('http://localhost:5000/api/enrollments/approveByInstructor', {
        _id,
      });
      setMessage(response.data.message);
      setRequests((prev) => prev.filter((req) => req._id !== _id));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error approving request');
    }
  };

  // Handle course rejection
  const handleReject = async (_id) => {
    try {
      const response = await axios.patch('http://localhost:5000/api/enrollments/rejectByInstructor', {
        _id,
      });
      setMessage(response.data.message);
      setRequests((prev) => prev.filter((req) => req._id !== _id));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error rejecting request');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Approve Student Requests</h2>

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
          <p>Loading requests...</p>
        </div>
      )}

      {/* Requests List */}
      {!loading && requests.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#6B7280' }}>No requests to approve at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map((request) => (
            <div
              key={request._id}
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
                  <span style={{ fontWeight: '600' }}>Student Email:</span> {request.studentEmail}
                </p>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  <span style={{ fontWeight: '600' }}>Course Name:</span> {request.courseName}
                </p>
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  <span style={{ fontWeight: '600' }}>Current Status:</span> {request.status}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    backgroundColor: '#22C55E',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease',
                  }}
                  onClick={() => handleApprove(request._id)}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#16A34A')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#22C55E')}
                >
                  Approve
                </button>
                <button
                  style={{
                    backgroundColor: '#EF4444',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'background-color 0.2s ease',
                  }}
                  onClick={() => handleReject(request._id)}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#DC2626')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#EF4444')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveRequests;
