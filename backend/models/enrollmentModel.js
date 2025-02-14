const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructorEmail: { type: String, required: true },
  courseName: { type: String, required: true },
  status: {
    type: String,
    enum: ['Instructor Approval Pending', 'Faculty Advisor Approval Pending', 'Rejected', 'Enrolled'],
    default: 'Instructor Approval Pending',
  },
  instructors: { type: String }, // You don't need a default here, we will populate it during creation
});

// Hook to automatically set the `instructors` field when the document is saved
enrollmentSchema.pre('save', function (next) {
  if (this.instructors === undefined && this.instructorEmail) {
    this.instructors = this.instructorEmail; // Set `instructors` to `instructorEmail`
  }
  next();
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
