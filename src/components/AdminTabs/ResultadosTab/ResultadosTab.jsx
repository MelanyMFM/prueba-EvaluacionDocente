import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../context/AppContext';
import { db2 } from '../../../firebaseApp2';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import ResultadosEncuesta from '../../ResultadosEncuesta';
import * as XLSX from 'xlsx';
import './resultadosTab.css';

function ResultadosTab() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [responses, setResponses] = useState([]);
  const [results, setResults] = useState({});
  const [resultsPublished, setResultsPublished] = useState(false);

  const {
    courses,
    factoresDisponibles,
    currentPeriod,
    currentSede,
    teachers,
    publishResults 
  } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener responses desde la colección 'results'
        const snapshot = await getDocs(collection(db2, 'results'));
        const fetchedResponses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Filtrar por periodo y sede actuales
        const filtered = fetchedResponses.filter(r => {
          return r.periodId === currentPeriod && r.sede === currentSede;
        });

        setResponses(filtered);

        // 2. Obtener resultados publicados
        const resultsSnap = await getDoc(doc(db2, 'resultsForm', `${currentPeriod}_${currentSede}`));
        if (resultsSnap.exists()) {
          setResults(resultsSnap.data());
          setResultsPublished(true);
        } else {
          setResults({});
          setResultsPublished(false);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    if (currentPeriod && currentSede) {
      fetchData();
    }
  }, [currentPeriod, currentSede]);

  const getTeacherCourseResults = (teacherId) => {
    if (!teacherId) return [];

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

        const courseEntry = courseResponses[response.courseId];
        courseEntry.participaciones += 1;

        const factores = response.factores || {};

        Object.entries(factores).forEach(([factorId, factor]) => {
          if (!courseEntry.factores[factorId]) {
            courseEntry.factores[factorId] = {
              nombre: factor.nombre || factoresDisponibles.find(f => f.id === factorId)?.nombre || 'Factor desconocido',
              totalPuntaje: 0,
              totalPreguntas: 0,
              promedio: 0
            };
          }
          courseEntry.factores[factorId].totalPuntaje += factor.totalPuntaje || 0;
          courseEntry.factores[factorId].totalPreguntas += factor.totalPreguntas || 0;
        });

        courseEntry.promedioGeneral += parseFloat(response.promedioGeneral || 0);
      }
    });

    return Object.values(courseResponses).map(course => {
      const courseInfo = courses.find(c => c.id === course.courseId) || { nombre: 'Curso desconocido' };
      Object.values(course.factores).forEach(factor => {
        factor.promedio = factor.totalPreguntas > 0
          ? (factor.totalPuntaje / factor.totalPreguntas).toFixed(2)
          : '0.00';
      });

      return {
        nombreAsignatura: courseInfo.nombre,
        participaciones: course.participaciones,
        factores: course.factores,
        promedioGeneral: course.participaciones > 0
          ? (course.promedioGeneral / course.participaciones).toFixed(2)
          : '0.00'
      };
    });
  };

  const exportToExcel = () => {
    if (!selectedTeacher || !results[selectedTeacher]) return;

    const teacherResults = results[selectedTeacher];
    const courseResults = getTeacherCourseResults(selectedTeacher);
    const wb = XLSX.utils.book_new();

    const summaryData = [
      ['Docente', teacherResults.nombre],
      ['Total de Participaciones', courseResults.reduce((sum, c) => sum + c.participaciones, 0)],
      ['Promedio General', teacherResults.promedioGeneral],
      [],
      ['Resultados por Factor'],
      ['Factor', 'Promedio']
    ];

    Object.entries(teacherResults.factores || {}).forEach(([_, factor]) => {
      summaryData.push([factor.nombre, factor.promedio]);
    });

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Resumen General');

    courseResults.forEach(course => {
      const courseData = [
        ['Asignatura', course.nombreAsignatura],
        ['Participaciones', course.participaciones],
        ['Promedio General', course.promedioGeneral],
        [],
        ['Resultados por Factor'],
        ['Factor', 'Promedio']
      ];

      Object.entries(course.factores).forEach(([_, factor]) => {
        courseData.push([factor.nombre, factor.promedio]);
      });

      const sheetName = course.nombreAsignatura.substring(0, 31) || 'Asignatura';
      const courseSheet = XLSX.utils.aoa_to_sheet(courseData);
      XLSX.utils.book_append_sheet(wb, courseSheet, sheetName);
    });

    XLSX.writeFile(wb, `Resultados_${teacherResults.nombre.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
  };

  return (
    <div className="resultados-tab">
      <h2>Resultados de la Evaluación</h2>
      <div className="results-actions">
        <p>Estado de los resultados: <strong>{resultsPublished ? 'Publicados' : 'No publicados'}</strong></p>
        <p>Respuestas recibidas hasta el momento: <strong>{responses.length}</strong></p>

        {!resultsPublished ? (
          <div>
          {responses.length > 0 && (
            <button className="btn-success" onClick={async () => {
              try {
                await publishResults();
                // volver a cargar los resultados publicados desde Firestore
                const resultsSnap = await getDoc(doc(db2, 'resultsForm', `${currentPeriod}_${currentSede}`));
                if (resultsSnap.exists()) {
                  setResults(resultsSnap.data());
                  setResultsPublished(true);
                }
              } catch (error) {
                console.error("Error al publicar resultados:", error);
              }
            }}>
              Publicar Resultados
            </button>
          )}
        </div>
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
                  <button onClick={exportToExcel} className="btn-secondary">Exportar a Excel</button>
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