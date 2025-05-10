import React, { createContext, useState, useEffect } from 'react';

// Datos iniciales de estudiantes
const initialStudents = [
  { id: "1016592846", nombre: "VENUS IDALI SAAMS AQUITUARI", email: "vsaams@unal.edu.co" },
  { id: "1006868597", nombre: "JUAN SEBASTIAN FLOREZ PUELLO", email: "jflorezpu@unal.edu.co" },
  { id: "1123623327", nombre: "ADAILSON CANTILLO PELUFO", email: "adcantillop@unal.edu.co" }
];

// Datos iniciales de docentes
const initialTeachers = [
  { id: "51709551", nombre: "Adriana Santos Martinez", email: "asantosma@unal.edu.co" },
  { id: "40987816", nombre: "Liza Hayes Mathias", email: "lhayesm@unal.edu.co" },
  { id: "52189598", nombre: "Angelica Piedad Ayala De La Hoz", email: "apayalad@unal.edu.co" },
  { id: "73569871", nombre: "Raul Roman Romero", email: "rromanr@unal.edu.co" },
  { id: "52424848", nombre: "Johannie Lucia James Cruz", email: "jljamesc@unal.edu.co" },
  { id: "79244154", nombre: "Jairo Humberto Medina Calderon", email: "jhmedinac@unal.edu.co" },
  { id: "52023234", nombre: "Juanita Montoya Galvis", email: "jmontoyaga@unal.edu.co" }
];

// Datos iniciales de cursos
const initialCourses = [
  { id: "1000009-M", nombre: "BIOLOGÍA GENERAL", grupo: "CARI-01" },
  { id: "1000001-M", nombre: "MATEMÁTICAS BÁSICAS", grupo: "CARI-02" },
  { id: "1000002-M", nombre: "LECTO-ESCRITURA", grupo: "CARI-04" },
  { id: "8000150", nombre: "LA DIMENSIÓN CARIBE DE LA NACIÓN COLOMBIANA", grupo: "1" },
  { id: "4100539", nombre: "FUNDAMENTOS DE ECONOMÍA", grupo: "CARI-01" },
  { id: "1000001-Z", nombre: "MATEMÁTICAS BÁSICAS", grupo: "CARI-02" },
  { id: "1000002-Z", nombre: "LECTO-ESCRITURA", grupo: "CARI-02" },
  { id: "1000089-C", nombre: "Cátedra nacional de inducción y preparación para la vida universitaria", grupo: "CARI-02" },
  { id: "2016082", nombre: "Problemas contemporáneos de las artes", grupo: "CARI-01" }
];

// Periodos académicos iniciales
const initialPeriods = [
  { id: "2023-1", nombre: "2023-1" },
  { id: "2023-2", nombre: "2023-2" },
  { id: "2024-1", nombre: "2024-1" }
];

// Relación entre estudiantes, cursos y docentes (ahora con periodo)
const initialStudentCourses = [
  { studentId: "1016592846", courseId: "1000009-M", teacherId: "51709551", group: "CARI-01", period: "2023-2" },
  { studentId: "1016592846", courseId: "1000001-M", teacherId: "40987816", group: "CARI-02", period: "2023-2" },
  { studentId: "1016592846", courseId: "1000002-M", teacherId: "52189598", group: "CARI-04", period: "2023-2" },
  { studentId: "1016592846", courseId: "8000150", teacherId: "73569871", group: "1", period: "2024-1" },
  { studentId: "1006868597", courseId: "4100539", teacherId: "52424848", group: "CARI-01", period: "2023-2" },
  { studentId: "1006868597", courseId: "1000001-Z", teacherId: "40987816", group: "CARI-02", period: "2023-2" },
  { studentId: "1006868597", courseId: "1000002-Z", teacherId: "52189598", group: "CARI-04", period: "2023-2" },
  { studentId: "1006868597", courseId: "8000150", teacherId: "73569871", group: "1", period: "2024-1" },
  { studentId: "1006868597", courseId: "1000089-C", teacherId: "79244154", group: "CARI-02", period: "2024-1" },
  { studentId: "1123623327", courseId: "2016082", teacherId: "52023234", group: "CARI-01", period: "2023-2" },
  { studentId: "1123623327", courseId: "1000001-Z", teacherId: "40987816", group: "CARI-02", period: "2023-2" },
  { studentId: "1123623327", courseId: "1000002-Z", teacherId: "52189598", group: "CARI-02", period: "2023-2" },
  { studentId: "1123623327", courseId: "8000150", teacherId: "73569871", group: "1", period: "2024-1" }
];

// Preguntas iniciales
const initialQuestions = [
  "¿El docente demuestra dominio de la materia?",
  "¿El docente explica con claridad?",
  "¿El docente responde adecuadamente las preguntas de los estudiantes?",
  "¿El docente es puntual en sus clases?"
];

// Pesos iniciales para cada pregunta
const initialWeights = [10, 10, 10, 10];

export const AppContext = createContext();

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

  // Función para verificar si la encuesta está activa para un periodo específico
  const isEncuestaActivaForPeriod = (periodId) => {
    return encuestaActiva[periodId] === true;
  };
  
  // Función para activar/desactivar la encuesta para un periodo específico
  const toggleEncuestaActivaForPeriod = (periodId, isActive) => {
    setEncuestaActiva(prev => ({
      ...prev,
      [periodId]: isActive
    }));
  };
  
  // Función para verificar si los resultados están publicados para un periodo específico
  const areResultsPublishedForPeriod = (periodId) => {
    return resultsPublished[periodId] === true;
  };
  
  // Función para publicar resultados para un periodo específico
  const publishResults = (periodId) => {
    const calculatedResults = calculateResultsForPeriod(periodId);
    
    setResults(prev => ({
      ...prev,
      [periodId]: calculatedResults
    }));
    
    setResultsPublished(prev => ({
      ...prev,
      [periodId]: true
    }));
  };

  // Función para calcular resultados para un periodo específico
  const calculateResultsForPeriod = (periodId) => {
    const newResults = {};
    
    // Inicializar resultados para cada docente
    teachers.forEach(teacher => {
      newResults[teacher.id] = {
        nombre: teacher.nombre,
        puntaje: 0,
        totalRespuestas: 0,
        cursos: {}
      };
    });
    
    // Filtrar respuestas por periodo
    const periodResponses = responses.filter(response => {
      // Buscar la inscripción correspondiente para obtener el periodo
      const enrollment = studentCourses.find(
        sc => sc.studentId === response.studentId && 
              sc.teacherId === response.teacherId && 
              sc.courseId === response.courseId
      );
      
      return enrollment && enrollment.period === periodId;
    });
    
    // Calcular puntajes basados en las respuestas del periodo
    periodResponses.forEach(response => {
      const { teacherId, courseId, answers } = response;
      
      if (newResults[teacherId]) {
        let totalScore = 0;
        
        // Calcular puntaje ponderado
        answers.forEach((answer, index) => {
          totalScore += (answer * questionWeights[index]) / 10;
        });
        
        const scorePerQuestion = totalScore / answers.length;
        
        // Inicializar datos del curso si no existen
        if (!newResults[teacherId].cursos[courseId]) {
          const course = courses.find(c => c.id === courseId);
          newResults[teacherId].cursos[courseId] = {
            nombreAsignatura: course ? course.nombre : 'Curso desconocido',
            participaciones: 0,
            nota: 0
          };
        }
        
        // Actualizar resultados del docente por curso
        newResults[teacherId].cursos[courseId].participaciones += 1;
        newResults[teacherId].cursos[courseId].nota += scorePerQuestion;
        
        // Actualizar resultados generales del docente
        newResults[teacherId].puntaje += scorePerQuestion;
        newResults[teacherId].totalRespuestas += 1;
      }
    });
    
    // Calcular promedios finales
    Object.keys(newResults).forEach(teacherId => {
      // Calcular promedio general del docente
      if (newResults[teacherId].totalRespuestas > 0) {
        newResults[teacherId].puntaje = (
          newResults[teacherId].puntaje / newResults[teacherId].totalRespuestas
        ).toFixed(2);
      }
      
      // Calcular promedio por curso
      Object.keys(newResults[teacherId].cursos).forEach(courseId => {
        const curso = newResults[teacherId].cursos[courseId];
        if (curso.participaciones > 0) {
          curso.nota = (curso.nota / curso.participaciones).toFixed(2);
        }
      });
      
      // Convertir el objeto de cursos a un array para facilitar su uso
      newResults[teacherId].cursosArray = Object.values(newResults[teacherId].cursos);
    });
    
    return newResults;
  };

  // Función para agregar una respuesta (ahora con periodo)
  const addResponse = (response) => {
    // Verificar si ya existe una respuesta para este estudiante, curso y docente en este periodo
    const existingResponseIndex = responses.findIndex(
      r => r.studentId === response.studentId && 
           r.teacherId === response.teacherId && 
           r.courseId === response.courseId &&
           r.periodId === response.periodId
    );
    
    if (existingResponseIndex >= 0) {
      // Si ya existe, actualizar la respuesta existente
      const updatedResponses = [...responses];
      updatedResponses[existingResponseIndex] = response;
      setResponses(updatedResponses);
      
      // Guardar en localStorage
      localStorage.setItem('responses', JSON.stringify(updatedResponses));
      console.log('Respuesta actualizada:', response);
    } else {
      // Si no existe, agregar nueva respuesta
      const newResponses = [...responses, response];
      setResponses(newResponses);
      
      // Guardar en localStorage
      localStorage.setItem('responses', JSON.stringify(newResponses));
      console.log('Nueva respuesta agregada:', response);
    }
    
    return true; // Indicar que la operación fue exitosa
  };

  // Función para verificar si un estudiante ya evaluó a un docente en un curso específico
  const hasStudentEvaluatedTeacher = (studentId, teacherId, courseId) => {
    return responses.some(
      response => 
        response.studentId === studentId && 
        response.teacherId === teacherId &&
        response.courseId === courseId
    );
  };

  // Función para obtener los cursos de un estudiante para un periodo específico que aún no ha evaluado
  const getCoursesForStudentByPeriod = (studentId, periodId) => {
    // Filtrar los cursos del estudiante para el periodo específico
    const studentEnrollments = studentCourses.filter(
      enrollment => enrollment.studentId === studentId && enrollment.period === periodId
    );
    
    // Filtrar solo los cursos que el estudiante no ha evaluado aún
    const coursesToEvaluate = studentEnrollments.filter(
      enrollment => !hasStudentEvaluatedTeacher(
        studentId, 
        enrollment.teacherId, 
        enrollment.courseId
      )
    );
    
    // Mapear a un formato más completo con nombres de cursos y docentes
    return coursesToEvaluate.map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      const teacher = teachers.find(t => t.id === enrollment.teacherId);
      
      return {
        courseId: enrollment.courseId,
        teacherId: enrollment.teacherId,
        courseName: course ? course.nombre : 'Curso desconocido',
        teacherName: teacher ? teacher.nombre : 'Docente desconocido',
        group: enrollment.group,
        period: enrollment.period
      };
    });
  };

  // Función para obtener los periodos disponibles para un estudiante
  const getPeriodsForStudent = (studentId) => {
    // Obtener todos los periodos únicos en los que el estudiante tiene cursos
    const studentPeriods = [...new Set(
      studentCourses
        .filter(enrollment => enrollment.studentId === studentId)
        .map(enrollment => enrollment.period)
    )];
    
    // Mapear a objetos de periodo completos
    return periods.filter(period => studentPeriods.includes(period.id));
  };

  // Función para obtener los periodos disponibles para un docente
  const getPeriodsForTeacher = (teacherId) => {
    // Obtener todos los periodos únicos en los que el docente tiene cursos
    const teacherPeriods = [...new Set(
      studentCourses
        .filter(enrollment => enrollment.teacherId === teacherId)
        .map(enrollment => enrollment.period)
    )];
    
    // Mapear a objetos de periodo completos
    return periods.filter(period => teacherPeriods.includes(period.id));
  };

  // Función para obtener los resultados de un docente para un periodo específico
  const getTeacherResultsForPeriod = (teacherId, periodId) => {
    if (!results[periodId] || !results[periodId][teacherId]) {
      return {
        nombre: teachers.find(t => t.id === teacherId)?.nombre || 'Docente desconocido',
        puntaje: 0,
        totalRespuestas: 0,
        cursosArray: []
      };
    }
    
    return results[periodId][teacherId];
  };

  // Función para actualizar la programación académica desde un archivo Excel
  const updateAcademicSchedule = (excelData) => {
    console.log("Actualizando programación académica con datos:", excelData.length);
    
    // Crear nuevas colecciones para almacenar los datos actualizados
    const newStudents = [];
    const newTeachers = [];
    const newCourses = [];
    const newStudentCourses = [];
    
    // Mapas para evitar duplicados
    const studentMap = new Map();
    const teacherMap = new Map();
    const courseMap = new Map();
    
    // Procesar cada fila del Excel
    excelData.forEach(row => {
      // Extraer periodo
      const period = String(row.PERIODO).trim();
      
      // Procesar estudiante
      const studentId = String(row.DOCUMENTO).trim();
      if (studentId && !studentMap.has(studentId)) {
        const studentName = String(row.NOMBRE_ESTUDIANTE).trim();
        const studentEmail = String(row.EMAIL).trim();
        
        newStudents.push({
          id: studentId,
          nombre: studentName,
          email: studentEmail
        });
        
        studentMap.set(studentId, true);
      }
      
      // Procesar docente
      const teacherId = String(row.DOC_DOCENTE_PPAL).trim();
      if (teacherId && !teacherMap.has(teacherId)) {
        const teacherName = String(row.NOMBRE_DOCENTE_PRINCIPAL).trim();
        const teacherEmail = String(row.EMAIL_DOCENTE_PRINCIPAL || '').trim();
        
        newTeachers.push({
          id: teacherId,
          nombre: teacherName,
          email: teacherEmail
        });
        
        teacherMap.set(teacherId, true);
      }
      
      // Procesar curso
      const courseId = String(row.ID_ASIGNATURA).trim();
      if (courseId && !courseMap.has(courseId)) {
        const courseName = String(row.ASIGNATURA).trim();
        
        newCourses.push({
          id: courseId,
          nombre: courseName
        });
        
        courseMap.set(courseId, true);
      }
      
      // Procesar inscripción de estudiante a curso
      if (studentId && courseId && teacherId && period) {
        const group = String(row.ID_GRUPO_ACTIVIDAD || '').trim();
        
        newStudentCourses.push({
          studentId,
          courseId,
          teacherId,
          period,
          group
        });
      }
    });
    
    // Actualizar el estado con los nuevos datos
    setStudents(newStudents);
    setTeachers(newTeachers);
    setCourses(newCourses);
    setStudentCourses(newStudentCourses);
    
    // Guardar en localStorage
    localStorage.setItem('students', JSON.stringify(newStudents));
    localStorage.setItem('teachers', JSON.stringify(newTeachers));
    localStorage.setItem('courses', JSON.stringify(newCourses));
    localStorage.setItem('studentCourses', JSON.stringify(newStudentCourses));
    
    // Actualizar periodos si es necesario
    const uniquePeriods = [...new Set(newStudentCourses.map(sc => sc.period))];
    const updatedPeriods = uniquePeriods.map(periodId => {
      // Buscar si ya existe este periodo
      const existingPeriod = periods.find(p => p.id === periodId);
      if (existingPeriod) {
        return existingPeriod;
      }
      
      // Si no existe, crear uno nuevo
      return {
        id: periodId,
        nombre: `Periodo ${periodId}`
      };
    });
    
    // Actualizar periodos en el estado y localStorage
    setPeriods(updatedPeriods);
    localStorage.setItem('periods', JSON.stringify(updatedPeriods));
    
    // Si no hay periodo actual seleccionado, seleccionar el primero
    if (!currentPeriod && updatedPeriods.length > 0) {
      setCurrentPeriod(updatedPeriods[0].id);
    }
    
    console.log("Programación académica actualizada con éxito");
    
    // Retornar estadísticas para mostrar en la UI
    return {
      studentsCount: newStudents.length,
      teachersCount: newTeachers.length,
      coursesCount: newCourses.length,
      studentCoursesCount: newStudentCourses.length
    };
  };

  // Función para agregar un nuevo periodo
  const addPeriod = (periodId, periodName) => {
    if (periods.some(p => p.id === periodId)) {
      return {
        success: false,
        message: 'El periodo ya existe'
      };
    }
    
    const newPeriod = { id: periodId, nombre: periodName };
    setPeriods(prev => [...prev, newPeriod]);
    
    return {
      success: true,
      message: 'Periodo agregado correctamente'
    };
  };

  return (
    <AppContext.Provider
      value={{
        // Estados
        encuestaActiva,
        setEncuestaActiva,
        questions,
        setQuestions,
        questionWeights,
        setQuestionWeights,
        responses,
        setResponses,
        results,
        setResults,
        resultsPublished,
        setResultsPublished,
        students,
        teachers,
        courses,
        studentCourses,
        periods,
        setPeriods,
        currentPeriod,
        setCurrentPeriod,
        
        // Funciones originales modificadas
        addResponse,
        hasStudentEvaluatedTeacher,
        
        // Nuevas funciones para periodos
        isEncuestaActivaForPeriod,
        toggleEncuestaActivaForPeriod,
        areResultsPublishedForPeriod,
        publishResults,
        calculateResultsForPeriod,
        getCoursesForStudentByPeriod,
        getPeriodsForStudent,
        getPeriodsForTeacher,
        getTeacherResultsForPeriod,
        updateAcademicSchedule,
        addPeriod
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
