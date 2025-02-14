const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  role:[ { 
    type: String, 
    required: true, 
    enum: ['Student', 'CourseInstructor', 'FacultyAdvisor'], // Enum to restrict roles
  }],
  otp: { 
    type: String, 
    required: false 
  },
  otpExpiresAt: { 
    type: Date, 
    required: false 
  },
});

module.exports = mongoose.model('User', userSchema);
