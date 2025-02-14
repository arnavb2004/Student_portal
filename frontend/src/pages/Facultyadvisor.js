import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApproveRequests from '../Components/ApproveRequestsAdvisor';

const Advisor = ({ setIsAuthenticated, setUserType }) => {
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
      <header style={styles.header}>
        <h1 style={styles.title}>Faculty Advisor Dashboard</h1>
        <p style={styles.email}>Logged in as: <strong>{instructor}</strong></p>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>
      <main style={styles.mainContent}>
        <ApproveRequests instructor={instructor} />
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '0 auto',
    maxWidth: '800px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#32b27a',
    color: 'white',
    borderRadius: '10px 10px 0 0',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
  },
  email: {
    fontSize: '16px',
    margin: '10px 0',
  },
  logoutButton: {
    padding: '10px 20px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '5px',
    backgroundColor: '#d9534f',
    color: 'white',
    transition: '0.3s ease',
    marginTop: '10px',
  },
  logoutButtonHover: {
    backgroundColor: '#c9302c',
  },
  mainContent: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '0 0 10px 10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
};

export default Advisor;
