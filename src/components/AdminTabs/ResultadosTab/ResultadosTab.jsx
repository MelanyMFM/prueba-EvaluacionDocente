import React, { useState, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import ResultadosEncuesta from '../../ResultadosEncuesta';
import * as XLSX from 'xlsx';
import "./resultadosTab.css";

function ResultadosTab({ resultsPublished, publishResults, responses, results }) {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { courses, factoresDisponibles } = useContext(AppContext);
  
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
            factores: {},
            promedioGeneral: 0
          };
        }
        
        courseResponses[response.courseId].participaciones += 1;
        
        // Actualizar factores
        Object.entries(response.factores || {}).forEach(([factorId, factor]) => {
          if (!courseResponses[response.courseId].factores[factorId]) {
            courseResponses[response.courseId].factores[factorId] = {
              nombre: factor.nombre,
              totalPuntaje: 0,
              totalPreguntas: 0,
              promedio: 0
            };
          }
          
          courseResponses[response.courseId].factores[factorId].totalPuntaje += factor.totalPuntaje;
          courseResponses[response.courseId].factores[factorId].totalPreguntas += factor.totalPreguntas;
        });
        
        // Actualizar promedio general
        courseResponses[response.courseId].promedioGeneral += parseFloat(response.promedioGeneral);
      }
    });
    
    // Convertir a array y calcular promedios
    return Object.values(courseResponses).map(course => {
      const courseInfo = courses.find(c => c.id === course.courseId) || { nombre: 'Curso desconocido' };
      
      // Calcular promedios por factor
      Object.values(course.factores).forEach(factor => {
        if (factor.totalPreguntas > 0) {
          factor.promedio = (factor.totalPuntaje / factor.totalPreguntas).toFixed(2);
        }
      });
      
      return {
        nombreAsignatura: courseInfo.nombre,
        participaciones: course.participaciones,
        factores: course.factores,
        promedioGeneral: (course.promedioGeneral / course.participaciones).toFixed(2)
      };
    });
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (!selectedTeacher || !results[selectedTeacher]) return;
    
    const teacherResults = results[selectedTeacher];
    const courseResults = getTeacherCourseResults(selectedTeacher);
    
    // Crear hoja de trabajo
    const wb = XLSX.utils.book_new();
    
    // Hoja de resumen general
    const summaryData = [
      ['Docente', teacherResults.nombre],
      ['Total de Participaciones', courseResults.reduce((sum, course) => sum + course.participaciones, 0)],
      ['Promedio General', teacherResults.promedioGeneral],
      [],
      ['Resultados por Factor'],
      ['Factor', 'Promedio']
    ];
    
    // Agregar resultados por factor
    Object.entries(teacherResults.factores).forEach(([factorId, factor]) => {
      summaryData.push([factor.nombre, factor.promedio]);
    });
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen General');
    
    // Hoja por asignatura
    courseResults.forEach(course => {
      const courseData = [
        ['Asignatura', course.nombreAsignatura],
        ['Participaciones', course.participaciones],
        ['Promedio General', course.promedioGeneral],
        [],
        ['Resultados por Factor'],
        ['Factor', 'Promedio']
      ];
      
      Object.entries(course.factores).forEach(([factorId, factor]) => {
        courseData.push([factor.nombre, factor.promedio]);
      });
      
      const courseSheet = XLSX.utils.aoa_to_sheet(courseData);
      XLSX.utils.book_append_sheet(wb, courseSheet, course.nombreAsignatura.substring(0, 31)); // Excel limita nombres de hojas a 31 caracteres
    });
    
    // Guardar archivo
    XLSX.writeFile(wb, `Resultados_${teacherResults.nombre.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
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
                  <span className="teacher-score">Promedio: {results[teacherId].promedioGeneral}</span>
                </div>
              ))}
            </div>
            
            {selectedTeacher && (
              <div className="teacher-results-detail">
                <div className="results-header">
                  <h4>Resultados de {results[selectedTeacher].nombre}</h4>
                  <button onClick={exportToExcel} className="btn-secondary">
                    Exportar a Excel
                  </button>
                </div>
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