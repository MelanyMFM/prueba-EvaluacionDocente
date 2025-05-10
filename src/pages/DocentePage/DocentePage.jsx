import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import ResultadosEncuesta from '../../components/ResultadosEncuesta';
import PeriodSelector from '../../components/PeriodSelector';
import './docentePage.css';

function DocentePage() {
  const navigate = useNavigate();
  const { 
    teachers, 
    results, 
    studentCourses, 
    courses, 
    responses, 
    periods,
    currentPeriod,
    setCurrentPeriod,
    areResultsPublishedForPeriod
  } = useContext(AppContext);
  
  const [teacherId, setTeacherId] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [courseResults, setCourseResults] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);
  const [availablePeriods, setAvailablePeriods] = useState([]);

  // Verificar si el ID del docente es válido
  const handleAuthentication = () => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setAuthenticated(true);
      setTeacherInfo(teacher);
      
      // Obtener periodos disponibles para este docente
      const teacherPeriodsIds = [...new Set(
        studentCourses
          .filter(sc => sc.teacherId === teacherId)
          .map(sc => sc.period)
      )];
      
      const filteredPeriods = periods.filter(period => 
        teacherPeriodsIds.includes(period.id)
      );
      
      setAvailablePeriods(filteredPeriods);
      
      // Seleccionar el primer periodo disponible si el actual no está disponible
      if (filteredPeriods.length > 0) {
        const isCurrentPeriodAvailable = filteredPeriods.some(p => p.id === currentPeriod);
        if (!isCurrentPeriodAvailable) {
          const newPeriod = filteredPeriods[0].id;
          setSelectedPeriod(newPeriod);
          setCurrentPeriod(newPeriod);
          
          // Obtener las asignaturas del docente para el periodo seleccionado
          updateTeacherCoursesAndResults(teacher.id, newPeriod);
        } else {
          // Obtener las asignaturas del docente para el periodo seleccionado
          updateTeacherCoursesAndResults(teacher.id, currentPeriod);
        }
      }
    } else {
      alert('ID de docente no válido');
    }
  };
  
  // Función para actualizar cursos y resultados cuando cambia el periodo
  const updateTeacherCoursesAndResults = (teacherId, periodId) => {
    // Obtener las asignaturas del docente para el periodo seleccionado
    const teacherCoursesIds = studentCourses
      .filter(sc => sc.teacherId === teacherId && sc.period === periodId)
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
    
    // Calcular resultados por asignatura si están publicados para este periodo
    if (areResultsPublishedForPeriod(periodId)) {
      const resultsByCourse = getTeacherCourseResults(teacherId, periodId);
      setCourseResults(resultsByCourse);
    } else {
      setCourseResults([]);
    }
  };
  
  // Función para obtener resultados por asignatura para un docente en un periodo específico
  const getTeacherCourseResults = (teacherId, periodId) => {
    // Agrupar respuestas por curso para este docente y periodo
    const courseResponses = {};
    
    responses.forEach(response => {
      // Buscar la inscripción correspondiente para obtener el periodo
      const enrollment = studentCourses.find(
        sc => sc.studentId === response.studentId && 
              sc.teacherId === response.teacherId && 
              sc.courseId === response.courseId
      );
      
      if (response.teacherId === teacherId && enrollment && enrollment.period === periodId) {
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

  // Manejar cambio de periodo
  const handlePeriodChange = (periodId) => {
    setSelectedPeriod(periodId);
    setCurrentPeriod(periodId);
    
    if (authenticated && teacherInfo) {
      updateTeacherCoursesAndResults(teacherInfo.id, periodId);
    }
  };

  // Verificar si los resultados están publicados para el periodo seleccionado
  const resultsPublished = selectedPeriod ? areResultsPublishedForPeriod(selectedPeriod) : false;

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
          
          <PeriodSelector 
            periods={availablePeriods}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={handlePeriodChange}
            label="Seleccione el periodo académico:"
          />
          
          <div className="teacher-info">
            <h3>Información del Docente</h3>
            <p><strong>ID:</strong> {teacherInfo.id}</p>
            <p><strong>Email:</strong> {teacherInfo.email}</p>
            <p><strong>Periodo:</strong> {periods.find(p => p.id === selectedPeriod)?.nombre || 'No seleccionado'}</p>
            <p><strong>Asignaturas:</strong> {teacherCourses.length > 0 ? teacherCourses.join(', ') : 'No hay asignaturas asignadas para este periodo'}</p>
          </div>
          
          {resultsPublished ? (
            <div className="teacher-results">
              <h3>Resultados de su Evaluación - Periodo {selectedPeriod}</h3>
              {courseResults.length > 0 ? (
                <div className="results-card">
                  <ResultadosEncuesta 
                    teacherName={teacherInfo.nombre}
                    courseResults={courseResults}
                    showTeacherName={false}
                  />
                </div>
              ) : (
                <p>No hay resultados disponibles para su evaluación en este periodo.</p>
              )}
            </div>
          ) : (
            <div className="no-results">
              <p>Los resultados de la evaluación para el periodo {selectedPeriod} aún no han sido publicados.</p>
              <p>Por favor, vuelva a consultar más tarde.</p>
            </div>
          )}
          
          <button onClick={() => navigate('/')} className="back-button">
            Volver al Inicio
          </button>
        </div>
      )}
    </div>
  );
}

export default DocentePage;
  