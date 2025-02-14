const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true, // Ensure courseId is unique
  },
  instructor: {
    type: String,
    required: true, // Make instructor mandatory
  },
});

module.exports = mongoose.model('Course', courseSchema);
