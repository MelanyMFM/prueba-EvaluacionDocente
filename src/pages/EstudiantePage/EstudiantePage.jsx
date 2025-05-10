import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../../context/AppContext";
import CoursesList from "../../components/CoursesList/CoursesList";
import EncuestaForm from "../../components/EvaluationForm/EvaluationForm";
import PeriodSelector from "../../components/PeriodSelector";
import './estudiantePage.css';

function EstudiantePage() {
  const navigate = useNavigate();
  const { 
    students, 
    courses, 
    teachers, 
    studentCourses, 
    encuestaActiva,
    questions,
    periods,
    currentPeriod,
    setCurrentPeriod,
    isEncuestaActivaForPeriod,
    responses
  } = useContext(AppContext);
  
  const [studentId, setStudentId] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);
  const [availablePeriods, setAvailablePeriods] = useState([]);
  
  // Verificar si el ID del estudiante es válido
  const handleAuthentication = () => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setAuthenticated(true);
      
      // Obtener periodos disponibles para este estudiante
      const studentPeriodsIds = [...new Set(
        studentCourses
          .filter(sc => sc.studentId === studentId)
          .map(sc => sc.period)
      )];
      
      const filteredPeriods = periods.filter(period => 
        studentPeriodsIds.includes(period.id)
      );
      
      setAvailablePeriods(filteredPeriods);
      
      // Seleccionar el primer periodo disponible si el actual no está disponible
      if (filteredPeriods.length > 0) {
        const isCurrentPeriodAvailable = filteredPeriods.some(p => p.id === currentPeriod);
        if (!isCurrentPeriodAvailable) {
          setSelectedPeriod(filteredPeriods[0].id);
          setCurrentPeriod(filteredPeriods[0].id);
        }
      }
    } else {
      alert('ID de estudiante no válido');
    }
  };
  
  // Obtener los cursos del estudiante para el periodo seleccionado
  const getStudentCourses = () => {
    const studentCoursesData = studentCourses.filter(
      sc => sc.studentId === studentId && sc.period === selectedPeriod
    );
    
    return studentCoursesData.map(sc => {
      const course = courses.find(c => c.id === sc.courseId);
      const teacher = teachers.find(t => t.id === sc.teacherId);
      
      // Verificar si ya existe una evaluación para este curso y docente
      const isEvaluated = responses.some(
        r => r.studentId === studentId && 
             r.teacherId === sc.teacherId && 
             r.courseId === sc.courseId &&
             r.periodId === selectedPeriod
      );
      
      return {
        courseId: sc.courseId,
        teacherId: sc.teacherId,
        courseName: course ? course.nombre : 'Curso desconocido',
        teacherName: teacher ? teacher.nombre : 'Docente desconocido',
        group: sc.group,
        isEvaluated: isEvaluated // Agregar esta propiedad
      };
    });
  };
  
  const handleSelectTeacher = (teacherId, courseId) => {
    setSelectedTeacher(teacherId);
    setSelectedCourse(courseId);
    setShowForm(true);
  };
  
  const handleSubmitForm = (responseData) => {
    if (responseData && responseData.success) {
      setShowForm(false);
      setSelectedTeacher(null);
      setSelectedCourse(null);
      
      // Mostrar mensaje de éxito
      alert('¡Evaluación enviada correctamente!');
    } else {
      // Si hay un error, mostrar mensaje pero no cerrar el formulario
      alert('Hubo un problema al enviar la evaluación. Por favor, intenta nuevamente.');
    }
  };
  
  const handlePeriodChange = (periodId) => {
    setSelectedPeriod(periodId);
    setCurrentPeriod(periodId);
    // Resetear selecciones al cambiar de periodo
    setSelectedTeacher(null);
    setSelectedCourse(null);
    setShowForm(false);
  };
  
  // Verificar si la encuesta está activa para el periodo seleccionado
  const isEncuestaActiva = selectedPeriod ? isEncuestaActivaForPeriod(selectedPeriod) : false;

  return (
    <div className="estudiante-container">
      <h1>Portal del Estudiante</h1>
      
      {!authenticated ? (
        <div className="auth-container">
          <h2>Ingrese su ID de estudiante</h2>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="ID de estudiante"
          />
          <button onClick={handleAuthentication}>Ingresar</button>
        </div>
      ) : (
        <div className="student-dashboard">
          <PeriodSelector 
            periods={availablePeriods}
            selectedPeriod={selectedPeriod}
            onSelectPeriod={handlePeriodChange}
            label="Seleccione el periodo académico:"
          />
          
          {!isEncuestaActiva ? (
            <div className="message-container">
              <h2>Encuesta no disponible</h2>
              <p>La encuesta de evaluación docente no está activa para el periodo {selectedPeriod}.</p>
              <button onClick={() => navigate('/')}>Volver al inicio</button>
            </div>
          ) : showForm ? (
            <div className="survey-container">
              <h2>Evaluación Docente - Periodo {selectedPeriod}</h2>
              <EncuestaForm
                studentId={studentId}
                teacherId={selectedTeacher}
                courseId={selectedCourse}
                periodId={selectedPeriod}
                onComplete={handleSubmitForm}
              />
              <button onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          ) : (
            <>
              <h2>Seleccione un docente para evaluar</h2>
              <CoursesList
                courses={getStudentCourses()}
                selectedTeacher={selectedTeacher}
                selectedCourse={selectedCourse}
                onSelectTeacher={handleSelectTeacher}
              />
              <button onClick={() => navigate('/')} className="back-button">
                Volver al Inicio
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EstudiantePage;