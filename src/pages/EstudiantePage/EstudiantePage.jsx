import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from "../../components/LoginForm/LoginForm";
import CoursesList from '../../components/EstudiantePage/CoursesList';
import EvaluationForm from '../../components/EstudiantePage/EvaluationForm';
import MessageDisplay from '../../components/EstudiantePage/MessageDisplay';
import './EstudiantePage.css';

function EstudiantePage() {
  const navigate = useNavigate();
  const { 
    encuestaActiva, 
    questions, 
    addResponse, 
    students, 
    teachers,
    hasStudentEvaluatedTeacher,
    getCoursesForStudent
  } = useContext(AppContext);
  
  const [studentId, setStudentId] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));
  const [authenticated, setAuthenticated] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Verificar si el ID del estudiante es válido (RF2.1)
  const handleAuthentication = () => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setAuthenticated(true);
      setStudentInfo(student);
      
      // Obtener cursos y docentes del estudiante (RF2.2)
      const courses = getCoursesForStudent(studentId);
      setStudentCourses(courses);
    } else {
      alert('Documento de estudiante no válido');
    }
  };

  // Manejar cambios en las respuestas (RF2.3)
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };

  // Seleccionar docente y curso
  const handleTeacherSelection = (teacherId, courseId) => {
    setSelectedTeacher(teacherId);
    setSelectedCourse(courseId);
    setAnswers(Array(questions.length).fill(0));
  };

  // Enviar la encuesta (RF2.4 y RF2.5)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedTeacher || !selectedCourse) {
      alert('Seleccione un docente y curso para evaluar');
      return;
    }
    
    // Verificar que todas las preguntas tengan respuesta (RF2.4)
    if (answers.some(answer => answer === 0)) {
      alert('Responda todas las preguntas antes de enviar');
      return;
    }
    
    // Agregar la respuesta al contexto
    addResponse(studentId, selectedTeacher, selectedCourse, answers);
    
    // Actualizar la lista de cursos disponibles
    const updatedCourses = studentCourses.filter(
      course => !(course.teacherId === selectedTeacher && course.courseId === selectedCourse)
    );
    setStudentCourses(updatedCourses);
    
    // Limpiar el formulario
    setSelectedTeacher('');
    setSelectedCourse('');
    setAnswers(Array(questions.length).fill(0));
    setSubmitted(true);
    
    // Mostrar mensaje de éxito
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="estudiante-container">
      <h1>Evaluación Docente - EDIFICANDO</h1>
      
      {!authenticated ? (
        <LoginForm 
          studentId={studentId} 
          setStudentId={setStudentId} 
          onAuthenticate={handleAuthentication} 
        />
      ) : (
        <div className="survey-container">
          <h2>Bienvenido(a), {studentInfo.nombre}</h2>
          
          {!encuestaActiva ? (
            <MessageDisplay 
              type="inactive"
              onNavigateHome={() => navigate('/')}
            />
          ) : studentCourses.length === 0 ? (
            <MessageDisplay 
              type="completed"
              onNavigateHome={() => navigate('/')}
            />
          ) : (
            <>
              {submitted && (
                <div className="success-message">
                  ¡Evaluación enviada con éxito! Puedes continuar evaluando a otros docentes.
                </div>
              )}
              
              <CoursesList 
                courses={studentCourses}
                selectedTeacher={selectedTeacher}
                selectedCourse={selectedCourse}
                onSelectTeacher={handleTeacherSelection}
              />
              
              {selectedTeacher && selectedCourse && (
                <EvaluationForm 
                  questions={questions}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EstudiantePage;
