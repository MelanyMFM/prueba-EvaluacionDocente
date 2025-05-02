import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import './DocentePage.css';

function DocentePage() {
  const { teachers, results, resultsPublished, studentCourses, courses } = useContext(AppContext);
  const [teacherId, setTeacherId] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);

  // Verificar si el ID del docente es válido
  const handleAuthentication = () => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setAuthenticated(true);
      setTeacherInfo(teacher);
      
      // Obtener las asignaturas del docente
      const teacherCoursesIds = studentCourses
        .filter(sc => sc.teacherId === teacherId)
        .map(sc => sc.courseId);
      
      // Obtener los nombres de las asignaturas sin duplicados
      const courseNames = [];
      teacherCoursesIds.forEach(courseId => {
        const courseInfo = courses.find(c => c.id === courseId);
        if (courseInfo && !courseNames.includes(courseInfo.nombre)) {
          courseNames.push(courseInfo.nombre);
        }
      });
      
      setTeacherCourses(courseNames);
    } else {
      alert('ID de docente no válido. Por favor, intente de nuevo.');
    }
  };

  return (
    <div className="docente-container">
      <h1>Portal Docente - EDIFICANDO</h1>
      
      {!authenticated ? (
        <div className="auth-container">
          <h2>Ingrese su ID de docente</h2>
          <input
            type="text"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            placeholder="ID de docente"
          />
          <button onClick={handleAuthentication}>Ingresar</button>
        </div>
      ) : (
        <div className="teacher-dashboard">
          <h2>Bienvenido(a), {teacherInfo.nombre}</h2>
          
          <div className="teacher-info">
            <h3>Información del Docente</h3>
            <p><strong>ID:</strong> {teacherInfo.id}</p>
            <p><strong>Email:</strong> {teacherInfo.email}</p>
            <p><strong>Asignaturas:</strong> {teacherCourses.length > 0 ? teacherCourses.join(', ') : 'No hay asignaturas asignadas'}</p>
          </div>
          
          {resultsPublished ? (
            <div className="teacher-results">
              <h3>Resultados de su Evaluación</h3>
              {results[teacherInfo.id] ? (
                <div className="results-card">
                  <h4>{teacherInfo.nombre}</h4>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Participaciones</th>
                        <th>Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{results[teacherInfo.id].totalRespuestas}</td>
                        <td>{results[teacherInfo.id].puntaje}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No hay resultados disponibles para su evaluación.</p>
              )}
            </div>
          ) : (
            <div className="no-results">
              <p>Los resultados de la evaluación aún no han sido publicados.</p>
              <p>Por favor, vuelva a consultar más tarde.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DocentePage;
  