import React from 'react';

function CoursesList({ courses, selectedTeacher, selectedCourse, onSelectTeacher }) {
  return (
    <div className="courses-container">
      <h3>Tus Materias y Docentes</h3>
      <div className="courses-list">
        {courses.map((course, index) => (
          <div key={index} className="course-item">
            <div className="course-info">
              <h4>{course.courseName}</h4>
              <p>Docente: {course.teacherName}</p>
              <p>Grupo: {course.group}</p>
            </div>
            <button 
              onClick={() => onSelectTeacher(course.teacherId, course.courseId)}
              className={selectedTeacher === course.teacherId && selectedCourse === course.courseId ? 'selected' : ''}
            >
              Evaluar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesList;