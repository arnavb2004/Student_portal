const express = require('express');
const router = express.Router();
const {
  requestEnrollment,
  approveByInstructor,
  approveByAdvisor,
} = require('../controllers/enrollmentController');

// Route to request enrollment
router.post('/request', requestEnrollment);

// Route to approve enrollment by instructor
router.post('/approve/instructor', approveByInstructor);

// Route to approve enrollment by advisor
router.post('/approve/advisor', approveByAdvisor);

module.exports = router;
