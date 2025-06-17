import './coursesList.css';

function CoursesList({ courses, onSelectTeacher }) {
  return (
    <div className="courses-list">
      {courses.length === 0 ? (
        <p className="no-courses">No hay cursos disponibles para este periodo.</p>
      ) : (
        courses.map((teacher, index) => (
          <div 
            key={index} 
            className={`course-item ${teacher.isEvaluated ? 'evaluated' : ''}`}
            onClick={() => !teacher.isEvaluated && onSelectTeacher(teacher.teacherId, teacher.courses[0].courseId)}
          >
            <h3>{teacher.teacherName}</h3>
            <div className="courses-info">
              <p><strong>Asignaturas:</strong></p>
              <ul>
                {teacher.courses.map((course, courseIndex) => (
                  <li key={courseIndex}>
                    {course.courseName} - Grupo {course.group}
                  </li>
                ))}
              </ul>
            </div>
            {teacher.isEvaluated ? (
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