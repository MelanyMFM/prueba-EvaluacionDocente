// Datos iniciales de estudiantes
export const initialStudents = [
  { id: "1016592846", nombre: "VENUS IDALI SAAMS AQUITUARI", email: "vsaams@unal.edu.co" },
  { id: "1006868597", nombre: "JUAN SEBASTIAN FLOREZ PUELLO", email: "jflorezpu@unal.edu.co" },
  { id: "1123623327", nombre: "ADAILSON CANTILLO PELUFO", email: "adcantillop@unal.edu.co" }
];

// Datos iniciales de docentes
export const initialTeachers = [
  { id: "51709551", nombre: "Adriana Santos Martinez", email: "asantosma@unal.edu.co" },
  { id: "40987816", nombre: "Liza Hayes Mathias", email: "lhayesm@unal.edu.co" },
  { id: "52189598", nombre: "Angelica Piedad Ayala De La Hoz", email: "apayalad@unal.edu.co" },
  { id: "73569871", nombre: "Raul Roman Romero", email: "rromanr@unal.edu.co" },
  { id: "52424848", nombre: "Johannie Lucia James Cruz", email: "jljamesc@unal.edu.co" },
  { id: "79244154", nombre: "Jairo Humberto Medina Calderon", email: "jhmedinac@unal.edu.co" },
  { id: "52023234", nombre: "Juanita Montoya Galvis", email: "jmontoyaga@unal.edu.co" }
];

// Datos iniciales de cursos
export const initialCourses = [
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
export const initialPeriods = [
  { id: "2023-1", nombre: "2023-1" },
  { id: "2023-2", nombre: "2023-2" },
  { id: "2024-1", nombre: "2024-1" }
];

// Relación entre estudiantes, cursos y docentes (ahora con periodo)
export const initialStudentCourses = [
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
export const initialQuestions = [
  "¿El docente demuestra dominio de la materia?",
  "¿El docente explica con claridad?",
  "¿El docente responde adecuadamente las preguntas de los estudiantes?",
  "¿El docente es puntual en sus clases?"
];

// Pesos iniciales para cada pregunta
export const initialWeights = [10, 10, 10, 10];