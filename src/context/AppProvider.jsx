import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { 
  initialStudents, 
  initialTeachers, 
  initialCourses, 
  initialPeriods, 
  initialStudentCourses, 
  initialQuestions, 
  initialWeights 
} from './initialData';
import { 
  isEncuestaActivaForPeriod, 
  areResultsPublishedForPeriod, 
  calculateResults,
  processAcademicSchedule
} from './contextHooks';

export const AppProvider = ({ children }) => {
  // Cargar datos del localStorage o usar los iniciales
  const [encuestaActiva, setEncuestaActiva] = useState(() => {
    const saved = localStorage.getItem('encuestaActiva');
    return saved !== null ? JSON.parse(saved) : {};
  });
  
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('questions');
    return saved !== null ? JSON.parse(saved) : initialQuestions;
  });
  
  const [questionWeights, setQuestionWeights] = useState(() => {
    const saved = localStorage.getItem('questionWeights');
    return saved !== null ? JSON.parse(saved) : initialWeights;
  });
  
  const [responses, setResponses] = useState(() => {
    const saved = localStorage.getItem('responses');
    return saved !== null ? JSON.parse(saved) : [];
  });
  
  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem('results');
    return saved !== null ? JSON.parse(saved) : {};
  });
  
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved !== null ? JSON.parse(saved) : initialStudents;
  });
  
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('teachers');
    return saved !== null ? JSON.parse(saved) : initialTeachers;
  });
  
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('courses');
    return saved !== null ? JSON.parse(saved) : initialCourses;
  });
  
  const [studentCourses, setStudentCourses] = useState(() => {
    const saved = localStorage.getItem('studentCourses');
    return saved !== null ? JSON.parse(saved) : initialStudentCourses;
  });
  
  const [resultsPublished, setResultsPublished] = useState(() => {
    const saved = localStorage.getItem('resultsPublished');
    return saved !== null ? JSON.parse(saved) : {};
  });
  
  const [periods, setPeriods] = useState(() => {
    const saved = localStorage.getItem('periods');
    return saved !== null ? JSON.parse(saved) : initialPeriods;
  });
  
  const [currentPeriod, setCurrentPeriod] = useState(() => {
    const saved = localStorage.getItem('currentPeriod');
    return saved !== null ? JSON.parse(saved) : periods[0]?.id || null;
  });

  // Guardar cambios en localStorage cuando cambian los estados
  useEffect(() => {
    localStorage.setItem('encuestaActiva', JSON.stringify(encuestaActiva));
  }, [encuestaActiva]);
  
  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);
  
  useEffect(() => {
    localStorage.setItem('questionWeights', JSON.stringify(questionWeights));
  }, [questionWeights]);
  
  useEffect(() => {
    localStorage.setItem('responses', JSON.stringify(responses));
  }, [responses]);
  
  useEffect(() => {
    localStorage.setItem('results', JSON.stringify(results));
  }, [results]);
  
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);
  
  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);
  
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);
  
  useEffect(() => {
    localStorage.setItem('studentCourses', JSON.stringify(studentCourses));
  }, [studentCourses]);
  
  useEffect(() => {
    localStorage.setItem('resultsPublished', JSON.stringify(resultsPublished));
  }, [resultsPublished]);
  
  useEffect(() => {
    localStorage.setItem('periods', JSON.stringify(periods));
  }, [periods]);
  
  useEffect(() => {
    localStorage.setItem('currentPeriod', JSON.stringify(currentPeriod));
  }, [currentPeriod]);

  // Función para activar/desactivar la encuesta para un periodo específico
  const toggleEncuestaActivaForPeriod = (periodId, isActive) => {
    setEncuestaActiva(prev => ({
      ...prev,
      [periodId]: isActive
    }));
  };
  
  // Función para publicar resultados para un periodo específico
  const publishResults = (periodId) => {
    // Calcular resultados
    const periodResults = calculateResults(
      responses, 
      studentCourses, 
      teachers, 
      courses, 
      questionWeights, 
      periodId
    );
    
    // Actualizar estado de resultados
    setResults(prev => ({
      ...prev,
      [periodId]: periodResults
    }));
    
    // Marcar como publicados
    setResultsPublished(prev => ({
      ...prev,
      [periodId]: true
    }));
    
    return periodResults;
  };
  
  // Función para agregar una respuesta
  const addResponse = (response) => {
    // Verificar si ya existe una respuesta para este estudiante, docente y curso
    const existingResponseIndex = responses.findIndex(
      r => r.studentId === response.studentId && 
           r.teacherId === response.teacherId && 
           r.courseId === response.courseId &&
           r.periodId === response.periodId
    );
    
    if (existingResponseIndex >= 0) {
      // Actualizar respuesta existente
      const updatedResponses = [...responses];
      updatedResponses[existingResponseIndex] = response;
      setResponses(updatedResponses);
    } else {
      // Agregar nueva respuesta
      setResponses([...responses, response]);
    }
  };
  
  // Función para actualizar la programación académica
  const updateAcademicSchedule = (data) => {
    const result = processAcademicSchedule(
      data, 
      students, 
      teachers, 
      courses, 
      studentCourses, 
      periods
    );
    
    // Actualizar estados
    setStudents(result.students);
    setTeachers(result.teachers);
    setCourses(result.courses);
    setStudentCourses(result.studentCourses);
    setPeriods(result.periods);
    
    return {
      studentsCount: result.studentsCount,
      teachersCount: result.teachersCount,
      coursesCount: result.coursesCount
    };
  };

  return (
    <AppContext.Provider value={{
      // Estados
      encuestaActiva,
      questions,
      questionWeights,
      responses,
      results,
      students,
      teachers,
      courses,
      studentCourses,
      resultsPublished,
      periods,
      currentPeriod,
      
      // Setters
      setQuestions,
      setQuestionWeights,
      setCurrentPeriod,
      
      // Funciones auxiliares
      isEncuestaActivaForPeriod: (periodId) => isEncuestaActivaForPeriod(encuestaActiva, periodId),
      areResultsPublishedForPeriod: (periodId) => areResultsPublishedForPeriod(resultsPublished, periodId),
      toggleEncuestaActivaForPeriod,
      publishResults,
      addResponse,
      updateAcademicSchedule
    }}>
      {children}
    </AppContext.Provider>
  );
};