import React from 'react';
import './coursesList.css';

function CoursesList({ courses, onSelectTeacher }) {
  return (
    <div className="courses-list">
      {courses.length === 0 ? (
        <p className="no-courses">No hay cursos disponibles para este periodo.</p>
      ) : (
        courses.map((course, index) => (
          <div 
            key={index} 
            className={`course-item ${course.isEvaluated ? 'evaluated' : ''}`}
            onClick={() => !course.isEvaluated && onSelectTeacher(course.teacherId, course.courseId)}
          >
            <h3>{course.courseName}</h3>
            <p><strong>Docente:</strong> {course.teacherName}</p>
            <p><strong>Grupo:</strong> {course.group}</p>
            {course.isEvaluated ? (
              <div className="evaluation-status">
                <span className="status-badge">Evaluado</span>
              </div>
            ) : (
              <button className="evaluate-button">Evaluar</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CoursesList;