import React, { createContext, useState, useEffect } from 'react';

// Datos iniciales de estudiantes
const initialStudents = [
  { id: "1016592846", nombre: "VENUS IDALI SAAMS AQUITUARI", email: "vsaams@unal.edu.co" },
  { id: "1006868597", nombre: "JUAN SEBASTIAN FLOREZ PUELLO", email: "jflorezpu@unal.edu.co" },
  { id: "1123623327", nombre: "ADAILSON CANTILLO PELUFO", email: "adcantillop@unal.edu.co" },
  { id: "123", nombre: "Melany", email: "mefrancom@unal.edu.co" },
  { id: "1234", nombre: "Marycielo", email: "mberrioz@unal.edu.co" }
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
  { studentId: "1123623327", courseId: "8000150", teacherId: "73569871", group: "1", period: "2024-1" },
  { studentId: "123", courseId: "1000009-M", teacherId: "51709551", group: "CARI-01", period: "2023-2" },
  { studentId: "123", courseId: "1000001-M", teacherId: "40987816", group: "CARI-02", period: "2023-2" },
  { studentId: "123", courseId: "1000002-M", teacherId: "52189598", group: "CARI-04", period: "2023-2" },
  { studentId: "123", courseId: "8000150", teacherId: "51709551", group: "1", period: "2023-2" },
  { studentId: "1234", courseId: "1000009-M", teacherId: "51709551", group: "CARI-01", period: "2023-2" },
  { studentId: "1234", courseId: "1000001-M", teacherId: "40987816", group: "CARI-02", period: "2023-2" },
  { studentId: "1234", courseId: "1000002-M", teacherId: "52189598", group: "CARI-04", period: "2023-2" },
  { studentId: "1234", courseId: "8000150", teacherId: "51709551", group: "1", period: "2023-2" },
];

// Factores para las preguntas
const factores = [
  { id: 1, nombre: "Factor 1" },
  { id: 2, nombre: "Factor 2" },
  { id: 3, nombre: "Factor 3" },
  { id: 4, nombre: "Factor 4" }
];

// Tipos de respuesta
const tiposRespuesta = {
  BINARIA: "binaria", // Sí/No
  FRECUENCIA: "frecuencia", // Nunca/A veces/Frecuentemente/Siempre
  FRECUENCIA_NA: "frecuencia_na", // Nunca/A veces/Frecuentemente/Siempre/No aplica
  VALORACION: "valoracion", // Muy bajo/Bajo/Alto/Muy alto
  ABIERTA: "abierta" // Respuesta de texto libre
};

// Preguntas iniciales con factor y tipo de respuesta
const initialQuestions = [
  {
    id: 1,
    texto: "¿Inscribiría con gusto otra actividad académica con este docente?",
    factor: 1,
    tipoRespuesta: tiposRespuesta.BINARIA
  },
  {
    id: 2,
    texto: "¿El docente promovió en usted la argumentación o la reflexión crítica?",
    factor: 1,
    tipoRespuesta: tiposRespuesta.BINARIA
  },
  {
    id: 3,
    texto: "¿El docente promovió la adquisición de diferentes herramientas para su aprendizaje autónomo?",
    factor: 1,
    tipoRespuesta: tiposRespuesta.BINARIA
  },
  {
    id: 4,
    texto: "¿Con este docente aprendió con suficiencia y a profundidad lo tratado en las actividades académicas?",
    factor: 1,
    tipoRespuesta: tiposRespuesta.BINARIA
  },
  {
    id: 5,
    texto: "¿El docente preparó adecuadamente cada sesión o actividad?",
    factor: 2,
    tipoRespuesta: tiposRespuesta.FRECUENCIA
  },
  {
    id: 6,
    texto: "¿El docente se esforzó por que usted aprendiera?",
    factor: 2,
    tipoRespuesta: tiposRespuesta.FRECUENCIA
  },
  {
    id: 7,
    texto: "¿El docente inspiró o motivó su interés por los temas tratados?",
    factor: 2,
    tipoRespuesta: tiposRespuesta.BINARIA
  },
  {
    id: 8,
    texto: "¿El docente propició que usted encontrara conexiones de los temas tratados con otros contextos o con otros contenidos de su plan de estudios?",
    factor: 2,
    tipoRespuesta: tiposRespuesta.BINARIA
  },
  {
    id: 9,
    texto: "¿El docente mostró agrado y entusiasmo por su labor de enseñanza?",
    factor: 3,
    tipoRespuesta: tiposRespuesta.FRECUENCIA
  },
  {
    id: 10,
    texto: "¿El docente respetó las reglas y fechas acordadas para las actividades académicas incluidas las evaluaciones?",
    factor: 3,
    tipoRespuesta: tiposRespuesta.FRECUENCIA
  },
  {
    id: 11,
    texto: "¿El docente dedicó tiempo suficiente o adecuado para asesorar, orientar y aclarar dudas?",
    factor: 3,
    tipoRespuesta: tiposRespuesta.FRECUENCIA_NA
  },
  {
    id: 12,
    texto: "¿El docente fue respetuoso con usted y tolerante con sus puntos de vista?",
    factor: 3,
    tipoRespuesta: tiposRespuesta.FRECUENCIA
  },
  {
    id: 13,
    texto: "¿El docente fue justo e imparcial durante las actividades académicas?",
    factor: 3,
    tipoRespuesta: tiposRespuesta.FRECUENCIA
  },
  {
    id: 14,
    texto: "¿El docente adecuó o modificó sus métodos de enseñanza según las necesidades de los estudiantes?",
    factor: 4,
    tipoRespuesta: tiposRespuesta.FRECUENCIA
  },
  {
    id: 15,
    texto: "¿Las evaluaciones hechas por el docente lo condujeron a mejorar su aprendizaje?",
    factor: 4,
    tipoRespuesta: tiposRespuesta.FRECUENCIA
  },
  {
    id: 16,
    texto: "¿Los resultados de las evaluaciones fueron un reflejo adecuado de su aprendizaje?",
    factor: 4,
    tipoRespuesta: tiposRespuesta.BINARIA
  },
  {
    id: 17,
    texto: "El desempeño global de este docente fue:",
    factor: 1,
    tipoRespuesta: tiposRespuesta.VALORACION
  },
  {
    id: 18,
    texto: "¿Qué aspectos positivos destacaría del desempeño del docente?",
    factor: 5,
    tipoRespuesta: tiposRespuesta.ABIERTA
  }
];

// Pesos iniciales para cada pregunta
const initialWeights = Array(initialQuestions.length).fill(10);

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
  
  // Añadir estado para factores
  const [factoresDisponibles, setFactoresDisponibles] = useState(() => {
    const saved = localStorage.getItem('factores');
    return saved !== null ? JSON.parse(saved) : factores;
  });
  
  // Añadir estado para tipos de respuesta
  const [tiposRespuestaDisponibles] = useState(tiposRespuesta);
  
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
    localStorage.setItem('factores', JSON.stringify(factoresDisponibles));
  }, [factoresDisponibles]);
  
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
    // Calcular resultados para este periodo
    const periodResponses = responses.filter(r => {
      // Buscar la inscripción correspondiente para obtener el periodo
      const enrollment = studentCourses.find(
        sc => sc.studentId === r.studentId && 
              sc.teacherId === r.teacherId && 
              sc.courseId === r.courseId
      );
      
      return enrollment && enrollment.period === periodId;
    });
    
    // Agrupar respuestas por docente
    const teacherResponses = {};
    
    periodResponses.forEach(response => {
      if (!teacherResponses[response.teacherId]) {
        teacherResponses[response.teacherId] = {
          teacherId: response.teacherId,
          responses: []
        };
      }
      
      teacherResponses[response.teacherId].responses.push(response);
    });
    
    // Calcular puntaje promedio para cada docente
    const teacherResults = {};
    
    Object.values(teacherResponses).forEach(teacher => {
      const teacherInfo = teachers.find(t => t.id === teacher.teacherId);
      
      if (!teacherInfo) return;
      
      // Calcular puntaje promedio de todas las respuestas
      let totalPuntaje = 0;
      let totalRespuestas = 0;
      
      teacher.responses.forEach(response => {
        // Calcular puntaje ponderado de esta respuesta
        let responsePuntaje = 0;
        let totalWeight = 0;
        
        response.answers.forEach((answer, index) => {
          // Obtener la pregunta correspondiente
          const question = questions[index];
          
          // Solo incluir en el cálculo si no es una pregunta abierta
          if (question && question.tipoRespuesta !== tiposRespuesta.ABIERTA) {
            // Aplicar peso de la pregunta
            const weight = questionWeights[index] || 10;
            responsePuntaje += answer * weight;
            totalWeight += weight;
          }
        });
        
        // Solo calcular el promedio si hay preguntas numéricas
        if (totalWeight > 0) {
          // Normalizar a escala 0-5
          const normalizedPuntaje = (responsePuntaje / totalWeight) * 5;
          totalPuntaje += normalizedPuntaje;
          totalRespuestas++;
        }
      });
      
      const promedioPuntaje = totalRespuestas > 0 ? totalPuntaje / totalRespuestas : 0;
      
      teacherResults[teacher.teacherId] = {
        nombre: teacherInfo.nombre,
        puntaje: promedioPuntaje.toFixed(2)
      };
    });
    
    // Actualizar resultados para este periodo
    setResults(prev => ({
      ...prev,
      [periodId]: teacherResults
    }));
    
    // Marcar resultados como publicados para este periodo
    setResultsPublished(prev => ({
      ...prev,
      [periodId]: true
    }));
  };
  
  // Función para agregar una nueva respuesta
  const addResponse = (response) => {
    setResponses(prev => [...prev, response]);
  };
  
  // Función para actualizar la programación académica
  const updateAcademicSchedule = (data) => {
    // Extraer estudiantes únicos
    const newStudents = [];
    const existingStudentIds = students.map(s => s.id);
    
    // Extraer docentes únicos
    const newTeachers = [];
    const existingTeacherIds = teachers.map(t => t.id);
    
    // Extraer cursos únicos
    const newCourses = [];
    const existingCourseIds = courses.map(c => c.id);
    
    // Extraer relaciones estudiante-curso-docente
    const newStudentCourses = [];
    
    // Extraer periodos únicos
    const newPeriods = [];
    const existingPeriodIds = periods.map(p => p.id);
    
    // Procesar cada fila del archivo Excel
    data.forEach(row => {
      // Extraer información del estudiante
      const studentId = row.DOCUMENTO?.toString();
      const studentName = row.NOMBRE_ESTUDIANTE;
      const studentEmail = row.EMAIL;
      
      if (studentId && studentName && !existingStudentIds.includes(studentId) && !newStudents.some(s => s.id === studentId)) {
        newStudents.push({
          id: studentId,
          nombre: studentName,
          email: studentEmail || `${studentId}@example.com`
        });
      }
      
      // Extraer información del docente
      const teacherId = row.DOC_DOCENTE_PPAL?.toString();
      const teacherName = row.NOMBRE_DOCENTE_PRINCIPAL;
      const teacherEmail = row.EMAIL_DOCENTE_PRINCIPAL;
      
      if (teacherId && teacherName && !existingTeacherIds.includes(teacherId) && !newTeachers.some(t => t.id === teacherId)) {
        newTeachers.push({
          id: teacherId,
          nombre: teacherName,
          email: teacherEmail || `${teacherId}@example.com`
        });
      }
      
      // Extraer información del curso
      const courseId = row.ID_ASIGNATURA?.toString();
      const courseName = row.ASIGNATURA;
      const courseGroup = row.ID_GRUPO_ACTIVIDAD?.toString() || "1";
      
      if (courseId && courseName && !existingCourseIds.includes(courseId) && !newCourses.some(c => c.id === courseId)) {
        newCourses.push({
          id: courseId,
          nombre: courseName,
          grupo: courseGroup
        });
      }
      
      // Extraer información del periodo
      const periodId = row.PERIODO?.toString();
      
      if (periodId && !existingPeriodIds.includes(periodId) && !newPeriods.some(p => p.id === periodId)) {
        newPeriods.push({
          id: periodId,
          nombre: periodId
        });
      }
      
      // Crear relación estudiante-curso-docente
      if (studentId && courseId && teacherId && periodId) {
        // Verificar si ya existe esta relación
        const existingRelation = studentCourses.some(
          sc => sc.studentId === studentId && 
                sc.courseId === courseId && 
                sc.teacherId === teacherId &&
                sc.period === periodId
        );
        
        const newRelationExists = newStudentCourses.some(
          sc => sc.studentId === studentId && 
                sc.courseId === courseId && 
                sc.teacherId === teacherId &&
                sc.period === periodId
        );
        
        if (!existingRelation && !newRelationExists) {
          newStudentCourses.push({
            studentId,
            courseId,
            teacherId,
            group: courseGroup,
            period: periodId
          });
        }
      }
    });
    
    // Actualizar estados
    setStudents(prev => [...prev, ...newStudents]);
    setTeachers(prev => [...prev, ...newTeachers]);
    setCourses(prev => [...prev, ...newCourses]);
    setPeriods(prev => [...prev, ...newPeriods]);
    setStudentCourses(prev => [...prev, ...newStudentCourses]);
    
    // Si no hay un periodo seleccionado y hay nuevos periodos, seleccionar el primero
    if (!currentPeriod && newPeriods.length > 0) {
      setCurrentPeriod(newPeriods[0].id);
    }
    
    // Retornar estadísticas
    return {
      studentsCount: newStudents.length,
      teachersCount: newTeachers.length,
      coursesCount: newCourses.length,
      periodsCount: newPeriods.length,
      relationsCount: newStudentCourses.length
    };
  };

  return (
    <AppContext.Provider value={{
      encuestaActiva,
      toggleEncuestaActivaForPeriod,
      questions,
      setQuestions,
      questionWeights,
      setQuestionWeights,
      factoresDisponibles,
      setFactoresDisponibles,
      tiposRespuestaDisponibles,
      responses,
      setResponses,
      addResponse,
      results,
      students,
      teachers,
      courses,
      studentCourses,
      resultsPublished,
      publishResults,
      periods,
      currentPeriod,
      setCurrentPeriod,
      isEncuestaActivaForPeriod,
      areResultsPublishedForPeriod,
      updateAcademicSchedule
    }}>
      {children}
    </AppContext.Provider>
  );
};
