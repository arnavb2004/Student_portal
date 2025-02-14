import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCourse from '../Components/AddCourse';
import ApproveRequests from '../Components/ApproveRequests';

const InstructorDashboard = ({ setIsAuthenticated, setUserType }) => {
  const [activeTab, setActiveTab] = useState('addCourse');
  const instructor = localStorage.getItem('userEmail'); // Fetch logged-in instructor email
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserType(null);
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>Instructor Dashboard</h1>
        <p style={styles.subtitle}>Manage your courses and student requests with ease</p>
      </header>

      {/* User Info & Logout */}
      <div style={styles.userInfo}>
        <span style={styles.instructorEmail}>
          <strong>Email:</strong> {instructor}
        </span>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav style={styles.navContainer}>
        <button
          onClick={() => setActiveTab('addCourse')}
          style={{
            ...styles.navButton,
            backgroundColor: activeTab === 'addCourse' ? '#007BFF' : '#f1f1f1',
            color: activeTab === 'addCourse' ? '#fff' : '#333',
          }}
        >
          Add Course
        </button>
        <button
          onClick={() => setActiveTab('approveRequests')}
          style={{
            ...styles.navButton,
            backgroundColor: activeTab === 'approveRequests' ? '#007BFF' : '#f1f1f1',
            color: activeTab === 'approveRequests' ? '#fff' : '#333',
          }}
        >
          Approve Requests
        </button>
      </nav>

      {/* Content Section */}
      <main style={styles.content}>
        {activeTab === 'addCourse' ? (
          <AddCourse instructor={instructor} />
        ) : (
          <ApproveRequests instructor={instructor} />
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f7f8fc',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#007BFF',
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    marginTop: '5px',
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '10px 15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  instructorEmail: {
    fontSize: '16px',
    color: '#333',
  },
  logoutButton: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#d9534f',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  navButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  content: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default InstructorDashboard;
