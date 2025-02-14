import React from 'react';

const CourseItem = ({ course, onEnroll }) => {
  return (
    <div className="course-item">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p><strong>Instructor:</strong> {course.instructor}</p>
      <button onClick={() => onEnroll(course._id)}>Request Enrollment</button>
    </div>
  );
};

export default CourseItem;
