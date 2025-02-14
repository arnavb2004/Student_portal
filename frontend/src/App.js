import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import InstructorDashboard from './pages/InstructorDashboard';
import Advisor from './pages/Facultyadvisor'; // Ensure that the component is properly named and imported
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  // Load authentication state from localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true'; // Convert to boolean
    const storedUserType = localStorage.getItem('userType');
    console.log('Auth Status:', authStatus, 'User Type:', storedUserType);

    if (authStatus && storedUserType) {
      setIsAuthenticated(authStatus);
      setUserType(storedUserType);
    } else {
      setIsAuthenticated(false);
      setUserType(null);
    }
  }, []);

  // Function to authenticate user and store in localStorage
  const authenticateUser = (status, role) => {
    setIsAuthenticated(status);
    setUserType(role);
    localStorage.setItem('isAuthenticated', status.toString());
    localStorage.setItem('userType', role);
  };

  // Function to log out user
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route: Redirect based on authentication and role */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                userType === 'CourseInstructor' ? (
                  <Navigate to="/instructor" />
                ) : userType === 'FacultyAdvisor' ? (
                  <Navigate to="/facultyadvisor" />
                ) : userType === 'Student' ? (
                  <Navigate to="/home" />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                userType === 'CourseInstructor' ? (
                  <Navigate to="/instructor" />
                ) : userType === 'FacultyAdvisor' ? (
                  <Navigate to="/facultyadvisor" />
                ) : (
                  <Navigate to="/home" />
                )
              ) : (
                <Login onAuthenticate={authenticateUser} />
              )
            }
          />

          {/* Student Home Page */}
          <Route
            path="/home"
            element={
              isAuthenticated && userType === 'Student' ? (
                <Home setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Instructor Dashboard */}
          <Route
            path="/instructor"
            element={
              isAuthenticated && userType === 'CourseInstructor' ? (
                <InstructorDashboard
                  setIsAuthenticated={setIsAuthenticated}
                  setUserType={setUserType}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Advisor Dashboard */}
          <Route
            path="/facultyadvisor"
            element={
              isAuthenticated && userType === 'FacultyAdvisor' ? (
                <Advisor
                  setIsAuthenticated={setIsAuthenticated}
                  setUserType={setUserType}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
