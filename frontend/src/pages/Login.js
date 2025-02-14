import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assests/iit.png'
const Login = ({ onAuthenticate }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to check if student email is valid
  const isValidStudentEmail = (email) => email.endsWith('@iitrpr.ac.in');

  // Async helper to validate instructor/advisor email and role
  const isValidInstructorOrAdvisorEmail = async (email, role, name) => {
    try {
      
      const response = await axios.post('http://localhost:5000/api/verify-instructor-advisor', { email, role, name });
      console.log(response.data.exists)
      return response.data.exists; // Backend should return { exists: true/false }
      
    } catch (error) {
      console.error('Error validating instructor/advisor email:', error);
      return false;
    }
  };

  // Send OTP logic
  const sendOtp = async () => {
    setMessage('');
    if (!email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }
    if (!role) {
      setMessage('Please select a role');
      return;
    }

    // Role-specific validation
    if (role === 'Student') {
      if (!isValidStudentEmail(email)) {
        setMessage('Students must use an @iitrpr.ac.in email address');
        return;
      }
    } else if (role === 'CourseInstructor' || role === 'FacultyAdvisor') {
      const isValid = await isValidInstructorOrAdvisorEmail(email, role , name);
      console.log(isValid)
      if (!isValid) {
        setMessage(`No ${role} found with this email address and/or name`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, role, name });
      setMessage(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP verification logic
  const verifyOtp = async () => {
    setMessage('');
    if (otp.length !== 6) {
      setMessage('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/verify', { email, otp, role });
      if (response.data.success) {
        localStorage.setItem('isAuthenticated', 'true'); // Store authentication status
        onAuthenticate(true, role);

        // Store user details in localStorage
        localStorage.setItem('userType', role);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);

        // Redirect to appropriate dashboard
        if (role === 'CourseInstructor') {
          navigate('/instructor');
        } else if (role === 'FacultyAdvisor') {
          navigate('/FacultyAdvisor');
        } else {
          navigate('/home');
        }
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.aimsHeading}>
        AIMS Portal
        <img
          src= {logo}
          alt="Logo"
          style={{ width: '150', height: '150px', verticalAlign: 'middle' }}
        />
      </h1>

      <div style={styles.container}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <label htmlFor="role" style={styles.label}>
          Select Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Select Role --</option>
          <option value="Student">Student</option>
          <option value="CourseInstructor">Course Instructor</option>
          <option value="FacultyAdvisor">Faculty Advisor</option>
        </select>
        {isOtpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={styles.input}
          />
        )}
        {!isOtpSent ? (
          <button onClick={sendOtp} style={styles.button} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        ) : (
          <button onClick={verifyOtp} style={styles.button} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        )}
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  aimsHeading: {
    backgroundColor: 'rgb(50, 178, 122)',
    color: 'white',
    textAlign: 'center',
    padding: '0px',
    fontSize: '40px',
    fontWeight: 'bold',
    margin: '0',
  },
  input: {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  select: {
    width: '92%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
  },
  label: {
    display: 'block',
    textAlign: 'center',
    margin: '10px 0 5px',
    fontSize: '20px',
    color: '#333',
    fontWeight: 'bold',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    color: '#333',
  },
};

export default Login;