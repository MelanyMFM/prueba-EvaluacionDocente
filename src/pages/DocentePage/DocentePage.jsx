import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import ResultadosEncuesta from '../../components/ResultadosEncuesta';
import './docentePage.css';

function DocentePage() {
  const { teachers, results, resultsPublished, studentCourses, courses, responses } = useContext(AppContext);
  const [teacherId, setTeacherId] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [courseResults, setCourseResults] = useState([]);

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
      
      // Calcular resultados por asignatura
      if (resultsPublished) {
        const resultsByCourse = getTeacherCourseResults(teacherId);
        setCourseResults(resultsByCourse);
      }
    } else {
      alert('ID de docente no válido');
    }
  };
  
  // Función para obtener resultados por asignatura para un docente
  const getTeacherCourseResults = (teacherId) => {
    // Agrupar respuestas por curso para este docente
    const courseResponses = {};
    
    responses.forEach(response => {
      if (response.teacherId === teacherId) {
        if (!courseResponses[response.courseId]) {
          courseResponses[response.courseId] = {
            courseId: response.courseId,
            participaciones: 0,
            totalPuntaje: 0
          };
        }
        
        // Calcular puntaje promedio de esta respuesta
        const respuestaPuntaje = response.answers.reduce((sum, val) => sum + val, 0) / response.answers.length;
        courseResponses[response.courseId].participaciones += 1;
        courseResponses[response.courseId].totalPuntaje += respuestaPuntaje;
      }
    });
    
    // Convertir a array y calcular promedios
    return Object.values(courseResponses).map(course => {
      const courseInfo = courses.find(c => c.id === course.courseId) || { nombre: 'Curso desconocido' };
      return {
        nombreAsignatura: courseInfo.nombre,
        participaciones: course.participaciones,
        nota: (course.totalPuntaje / course.participaciones).toFixed(2)
      };
    });
  };

  return (
    <div className="docente-container">
      <h1>Portal Docente</h1>
      
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
                  <ResultadosEncuesta 
                    teacherName={teacherInfo.nombre}
                    courseResults={courseResults}
                    showTeacherName={false}
                  />
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
  