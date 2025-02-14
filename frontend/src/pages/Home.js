import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnrolledCourses from '../Components/EnrolledCourses';
import AvailableCourses from '../Components/AvailableCourses';

const Home = ({ setIsAuthenticated, setUserType }) => {
  const navigate = useNavigate();
  const studentEmail = localStorage.getItem('userEmail'); // Fetch email from storage
  const studentName = localStorage.getItem('userName');

  // State for managing active tab
  const [activeTab, setActiveTab] = useState('enrolled'); // Default to 'enrolled'

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false); // Update state
    setUserType(null);
    navigate('/login'); 
  };

  // Tab switch handler
  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="home-container">
      <div style={styles.headerContainer}>
        <h1 style={styles.welcome}> Student Portal</h1>
        <button 
          style={styles.logoutButton} 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Student Details Form */}
      <div style={styles.formContainer}>
        <div style={styles.formRow}>
          <label>First Name:</label>
          <input type="text" value={studentName.split(' ')[0]} readOnly style={styles.input} />
        </div>
        <div style={styles.formRow}>
          <label>Last Name:</label>
          <input type="text" value={studentName.split(' ')[1] || ''} readOnly style={styles.input} />
        </div>
        <div style={styles.formRow}>
          <label>Email:</label>
          <input type="text" value={studentEmail} readOnly style={styles.input} />
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button 
          style={activeTab === 'enrolled' ? styles.activeTab : styles.tab} 
          onClick={() => handleTabSwitch('enrolled')}
        >
          Enrolled Courses
        </button>
        <button 
          style={activeTab === 'available' ? styles.activeTab : styles.tab} 
          onClick={() => handleTabSwitch('available')}
        >
          Available Courses
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="tab-content">
        {activeTab === 'enrolled' && <EnrolledCourses studentEmail={studentEmail} />}
        {activeTab === 'available' && <AvailableCourses studentEmail={studentEmail} />}
      </div>
    </div>
  );
};

const styles = {
  headerContainer: {
    display: 'flex',
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
    backgroundColor: 'rgb(50, 178, 122)',
    padding: '15px',
    color: 'white',
    position: 'relative', // Allows positioning of the logout button
  },
  welcome: {
    fontSize: '26px',
    fontWeight: 'bold',
    margin: '0',
    textAlign: 'center', // Aligns text horizontally
  },
  logoutButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    position: 'absolute', // Position it separately from the centered text
    right: '15px', // Push it to the right side of the header
  },
  formContainer: {
    margin: '20px auto',
    maxWidth: '500px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  formRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  input: {
    flex: '1',
    marginLeft: '10px',
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '3px',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
  },
  tab: {
    backgroundColor: '#e0e0e0',
    color: '#333',
    padding: '10px 20px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  activeTab: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px 20px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};


export default Home;
