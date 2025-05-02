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

// Relación entre estudiantes, cursos y docentes
const initialStudentCourses = [
  { studentId: "1016592846", courseId: "1000009-M", teacherId: "51709551", group: "CARI-01" },
  { studentId: "1016592846", courseId: "1000001-M", teacherId: "40987816", group: "CARI-02" },
  { studentId: "1016592846", courseId: "1000002-M", teacherId: "52189598", group: "CARI-04" },
  { studentId: "1016592846", courseId: "8000150", teacherId: "73569871", group: "1" },
  { studentId: "1006868597", courseId: "4100539", teacherId: "52424848", group: "CARI-01" },
  { studentId: "1006868597", courseId: "1000001-Z", teacherId: "40987816", group: "CARI-02" },
  { studentId: "1006868597", courseId: "1000002-Z", teacherId: "52189598", group: "CARI-04" },
  { studentId: "1006868597", courseId: "8000150", teacherId: "73569871", group: "1" },
  { studentId: "1006868597", courseId: "1000089-C", teacherId: "79244154", group: "CARI-02" },
  { studentId: "1123623327", courseId: "2016082", teacherId: "52023234", group: "CARI-01" },
  { studentId: "1123623327", courseId: "1000001-Z", teacherId: "40987816", group: "CARI-02" },
  { studentId: "1123623327", courseId: "1000002-Z", teacherId: "52189598", group: "CARI-02" },
  { studentId: "1123623327", courseId: "8000150", teacherId: "73569871", group: "1" }
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
    return saved !== null ? JSON.parse(saved) : false;
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
    return saved !== null ? JSON.parse(saved) : false;
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

  // Función para calcular resultados
  const calculateResults = () => {
    const newResults = {};
    
    // Inicializar resultados para cada docente
    teachers.forEach(teacher => {
      newResults[teacher.id] = {
        nombre: teacher.nombre,
        puntaje: 0,
        totalRespuestas: 0
      };
    });
    
    // Calcular puntajes basados en las respuestas
    responses.forEach(response => {
      const { teacherId, answers } = response;
      if (newResults[teacherId]) {
        let totalScore = 0;
        
        // Calcular puntaje ponderado
        answers.forEach((answer, index) => {
          totalScore += (answer * questionWeights[index]) / 10;
        });
        
        // Actualizar resultados del docente
        newResults[teacherId].puntaje += totalScore / answers.length;
        newResults[teacherId].totalRespuestas += 1;
      }
    });
    
    // Calcular promedio final
    Object.keys(newResults).forEach(teacherId => {
      if (newResults[teacherId].totalRespuestas > 0) {
        newResults[teacherId].puntaje = (
          newResults[teacherId].puntaje / newResults[teacherId].totalRespuestas
        ).toFixed(2);
      }
    });
    
    setResults(newResults);
    return newResults;
  };

  // Función para publicar resultados
  const publishResults = () => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setResultsPublished(true);
  };

  // Función para agregar una respuesta
  const addResponse = (studentId, teacherId, courseId, answers) => {
    const newResponse = {
      id: Date.now(),
      studentId,
      teacherId,
      courseId,
      answers,
      date: new Date().toISOString()
    };
    
    // Crear una nueva copia del array de respuestas
    const updatedResponses = [...responses, newResponse];
    
    // Actualizar el estado con la nueva copia
    setResponses(updatedResponses);
    
    // Forzar la actualización en localStorage
    localStorage.setItem('responses', JSON.stringify(updatedResponses));
    
    return {
      success: true,
      message: 'Respuesta registrada correctamente'
    };
  };

  // Función para verificar si un estudiante ya evaluó a un docente en un curso específico (RF2.5)
  const hasStudentEvaluatedTeacher = (studentId, teacherId, courseId) => {
    return responses.some(
      response => 
        response.studentId === studentId && 
        response.teacherId === teacherId &&
        response.courseId === courseId
    );
  };

  // Función para obtener los cursos de un estudiante que aún no ha evaluado (RF2.2)
  const getCoursesForStudent = (studentId) => {
    // Filtrar los cursos del estudiante
    const studentEnrollments = studentCourses.filter(
      enrollment => enrollment.studentId === studentId
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
        group: enrollment.group
      };
    });
  };

  // Función para actualizar la programación académica desde un archivo Excel
  const updateAcademicSchedule = (excelData) => {
    // Mapas para evitar duplicados
    const studentsMap = {};
    const teachersMap = {};
    const coursesMap = {};
    const relationsMap = {};
    
    // Procesar datos del Excel
    excelData.forEach(row => {
      // Función auxiliar para obtener el valor de un campo con posibles variaciones de nombre
      const getValue = (fieldOptions) => {
        for (const option of fieldOptions) {
          if (row[option] !== undefined) return row[option];
        }
        return null;
      };
  
      // Extraer información del estudiante
      const studentId = getValue(['DOCUMENTO', 'documento']).toString();
      if (studentId) {
        studentsMap[studentId] = {
          id: studentId,
          nombre: getValue(['NOMBRE_ESTUDIANTE', 'nombre_estudiante']),
          email: getValue(['EMAIL', 'email'])
        };
      }
      
      // Extraer información del docente
      const teacherId = getValue(['DOC_DOCENTE_PPAL', 'doc_docente_ppal']).toString();
      if (teacherId) {
        teachersMap[teacherId] = {
          id: teacherId,
          nombre: getValue(['NOMBRE_DOCENTE_PRINCIPAL', 'nombre_docente_principal']),
          email: getValue(['EMAIL_DOCENTE_PRINCIPAL', 'email_docente_principal'])
        };
      }
      
      // Extraer información del curso
      const courseId = getValue(['ID_ASIGNATURA', 'ID_ASSIGNATURA', 'id_asignatura', 'id_assignatura']).toString();
      const groupId = getValue(['ID_GRUPO_ACTIVIDAD', 'id_grupo_actividad']);
      if (courseId) {
        coursesMap[courseId] = {
          id: courseId,
          nombre: getValue(['ASIGNATURA', 'asignatura']),
          grupo: groupId ? groupId.toString() : 'DEFAULT'
        };
      }
      
      // Crear relación estudiante-curso-docente
      if (studentId && courseId && teacherId) {
        const relationKey = `${studentId}-${courseId}-${teacherId}`;
        relationsMap[relationKey] = {
          studentId,
          courseId,
          teacherId,
          group: groupId ? groupId.toString() : 'DEFAULT'
        };
      }
    });
    
    // Convertir mapas a arrays
    const newStudents = Object.values(studentsMap);
    const newTeachers = Object.values(teachersMap);
    const newCourses = Object.values(coursesMap);
    const newRelations = Object.values(relationsMap);
    
    // Actualizar el estado
    setStudents(newStudents);
    setTeachers(newTeachers);
    setCourses(newCourses);
    setStudentCourses(newRelations);
    
    // Forzar la actualización en localStorage
    localStorage.setItem('students', JSON.stringify(newStudents));
    localStorage.setItem('teachers', JSON.stringify(newTeachers));
    localStorage.setItem('courses', JSON.stringify(newCourses));
    localStorage.setItem('studentCourses', JSON.stringify(newRelations));
    
    return {
      studentsCount: newStudents.length,
      teachersCount: newTeachers.length,
      coursesCount: newCourses.length,
      relationsCount: newRelations.length
    };
  };

  return (
    <AppContext.Provider
      value={{
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
        calculateResults,
        publishResults,
        addResponse,
        hasStudentEvaluatedTeacher,
        getCoursesForStudent,
        updateAcademicSchedule // Agregar la nueva función al contexto
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
