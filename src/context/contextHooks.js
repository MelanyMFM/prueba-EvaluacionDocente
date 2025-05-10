// Función para verificar si la encuesta está activa para un periodo específico
export const isEncuestaActivaForPeriod = (encuestaActiva, periodId) => {
  return encuestaActiva[periodId] === true;
};

// Función para verificar si los resultados están publicados para un periodo específico
export const areResultsPublishedForPeriod = (resultsPublished, periodId) => {
  return resultsPublished[periodId] === true;
};

// Función para calcular resultados de evaluación
export const calculateResults = (responses, studentCourses, teachers, courses, questionWeights, periodId) => {
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
  
  // Agrupar respuestas por docente
  const teacherResponses = {};
  
  periodResponses.forEach(response => {
    if (!teacherResponses[response.teacherId]) {
      teacherResponses[response.teacherId] = {
        responses: [],
        totalPuntaje: 0,
        participaciones: 0
      };
    }
    
    teacherResponses[response.teacherId].responses.push(response);
    
    // Calcular puntaje ponderado de esta respuesta
    let puntajeTotal = 0;
    let pesoTotal = 0;
    
    response.answers.forEach((answer, index) => {
      const peso = questionWeights[index] || 1;
      puntajeTotal += answer * peso;
      pesoTotal += peso;
    });
    
    const puntajePromedio = puntajeTotal / pesoTotal;
    teacherResponses[response.teacherId].totalPuntaje += puntajePromedio;
    teacherResponses[response.teacherId].participaciones += 1;
  });
  
  // Calcular promedios y crear objeto de resultados
  const results = {};
  
  Object.keys(teacherResponses).forEach(teacherId => {
    const teacher = teachers.find(t => t.id === teacherId);
    const teacherData = teacherResponses[teacherId];
    
    if (teacher && teacherData.participaciones > 0) {
      const puntajePromedio = (teacherData.totalPuntaje / teacherData.participaciones).toFixed(2);
      
      results[teacherId] = {
        id: teacherId,
        nombre: teacher.nombre,
        puntaje: puntajePromedio,
        participaciones: teacherData.participaciones
      };
    }
  });
  
  return results;
};

// Función para procesar datos de programación académica
export const processAcademicSchedule = (data, students, teachers, courses, studentCourses, periods) => {
  // Nuevos arrays para almacenar datos actualizados
  const newStudents = [...students];
  const newTeachers = [...teachers];
  const newCourses = [...courses];
  const newStudentCourses = [...studentCourses];
  const newPeriods = [...periods];
  
  // Mapeo para evitar duplicados
  const studentMap = new Map(students.map(s => [s.id, s]));
  const teacherMap = new Map(teachers.map(t => [t.id, t]));
  const courseMap = new Map(courses.map(c => [c.id, c]));
  const periodMap = new Map(periods.map(p => [p.id, p]));
  
  // Procesar cada fila de datos
  data.forEach(row => {
    // Extraer información
    const periodId = row.PERIODO?.toString();
    const studentId = row.DOCUMENTO?.toString();
    const studentName = row.NOMBRE_ESTUDIANTE;
    const studentEmail = row.EMAIL;
    const courseId = row.ID_ASIGNATURA?.toString();
    const courseName = row.ASIGNATURA;
    const courseGroup = row.ID_GRUPO_ACTIVIDAD?.toString();
    const teacherId = row.DOC_DOCENTE_PPAL?.toString();
    const teacherName = row.NOMBRE_DOCENTE_PRINCIPAL;
    const teacherEmail = row.EMAIL_DOCENTE_PRINCIPAL;
    
    // Verificar datos mínimos necesarios
    if (!periodId || !studentId || !courseId || !teacherId) {
      console.warn("Fila con datos incompletos:", row);
      return; // Saltar esta fila
    }
    
    // Agregar periodo si no existe
    if (periodId && !periodMap.has(periodId)) {
      const newPeriod = { id: periodId, nombre: periodId };
      newPeriods.push(newPeriod);
      periodMap.set(periodId, newPeriod);
    }
    
    // Agregar estudiante si no existe
    if (studentId && !studentMap.has(studentId)) {
      const newStudent = { 
        id: studentId, 
        nombre: studentName || `Estudiante ${studentId}`, 
        email: studentEmail || `estudiante${studentId}@example.com` 
      };
      newStudents.push(newStudent);
      studentMap.set(studentId, newStudent);
    }
    
    // Agregar docente si no existe
    if (teacherId && !teacherMap.has(teacherId)) {
      const newTeacher = { 
        id: teacherId, 
        nombre: teacherName || `Docente ${teacherId}`, 
        email: teacherEmail || `docente${teacherId}@example.com` 
      };
      newTeachers.push(newTeacher);
      teacherMap.set(teacherId, newTeacher);
    }
    
    // Agregar curso si no existe
    if (courseId && !courseMap.has(courseId)) {
      const newCourse = { 
        id: courseId, 
        nombre: courseName || `Curso ${courseId}`, 
        grupo: courseGroup || "01" 
      };
      newCourses.push(newCourse);
      courseMap.set(courseId, newCourse);
    }
    
    // Agregar relación estudiante-curso-docente si no existe
    const enrollmentExists = newStudentCourses.some(
      sc => sc.studentId === studentId && 
            sc.courseId === courseId && 
            sc.teacherId === teacherId &&
            sc.period === periodId
    );
    
    if (!enrollmentExists) {
      newStudentCourses.push({
        studentId,
        courseId,
        teacherId,
        group: courseGroup || "01",
        period: periodId
      });
    }
  });
  
  return {
    students: newStudents,
    teachers: newTeachers,
    courses: newCourses,
    studentCourses: newStudentCourses,
    periods: newPeriods,
    studentsCount: newStudents.length,
    teachersCount: newTeachers.length,
    coursesCount: newCourses.length
  };
};