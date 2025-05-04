import React, { useState, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import ResultadosEncuesta from '../../ResultadosEncuesta';
import "./resultadosTab.css";

function ResultadosTab({ resultsPublished, publishResults, responses, results }) {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { courses } = useContext(AppContext);
  
  // Función para obtener resultados por asignatura para un docente
  const getTeacherCourseResults = (teacherId) => {
    if (!selectedTeacher) return [];
    
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
    <div className="resultados-tab">
      <h2>Resultados de la Evaluación</h2>
      <div className="results-actions">
        <p>
          Estado de los resultados: <strong>{resultsPublished ? 'Publicados' : 'No publicados'}</strong>
        </p>
        <p>
          Respuestas recibidas hasta el momento: <strong>{responses.length}</strong>
        </p>
        {!resultsPublished ? (
          <button onClick={publishResults} className="btn-success">
            Publicar Resultados
          </button>
        ) : (
          <div className="results-display">
            <h3>Lista de Docentes Evaluados</h3>
            <div className="teachers-list">
              {Object.keys(results).map(teacherId => (
                <div 
                  key={teacherId} 
                  className={`teacher-item ${selectedTeacher === teacherId ? 'selected' : ''}`}
                  onClick={() => setSelectedTeacher(selectedTeacher === teacherId ? null : teacherId)}
                >
                  <span className="teacher-name">{results[teacherId].nombre}</span>
                  <span className="teacher-score">Nota: {results[teacherId].puntaje}</span>
                </div>
              ))}
            </div>
            
            {selectedTeacher && (
              <div className="teacher-results-detail">
                <h4>Resultados de {results[selectedTeacher].nombre}</h4>
                <ResultadosEncuesta 
                  teacherName={results[selectedTeacher].nombre}
                  courseResults={getTeacherCourseResults(selectedTeacher)}
                  showTeacherName={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultadosTab;