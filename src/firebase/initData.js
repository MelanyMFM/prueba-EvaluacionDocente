// src/firebase/initData.js
import { db2 } from '../firebaseApp2';
import { collection, setDoc, doc } from 'firebase/firestore';
const tiposRespuesta = {
    BINARIA: "binaria", // Sí/No
    FRECUENCIA: "frecuencia", // Nunca/A veces/Frecuentemente/Siempre
    FRECUENCIA_NA: "frecuencia_na", // Nunca/A veces/Frecuentemente/Siempre/No aplica
    VALORACION: "valoracion", // Muy bajo/Bajo/Alto/Muy alto
    ABIERTA: "abierta" // Respuesta de texto libre
  };

// 🔸 Tus datos reales pegados directamente aquí
const students = [
  { id: "1016592846", nombre: "VENUS IDALI SAAMS AQUITUARI", email: "vsaams@unal.edu.co" },
  { id: "1006868597", nombre: "JUAN SEBASTIAN FLOREZ PUELLO", email: "jflorezpu@unal.edu.co" },
  { id: "1123623327", nombre: "ADAILSON CANTILLO PELUFO", email: "adcantillop@unal.edu.co" },
  { id: "123", nombre: "Melany", email: "mefrancom@unal.edu.co" },
  { id: "1234", nombre: "Marycielo", email: "mberrioz@unal.edu.co" },
  { id: "12345", nombre: "Nestor Augusto Tocancipa", email: "natocancipag@unal.edu.co" }
];

const teachers = [
  { id: "51709551", nombre: "Adriana Santos Martinez", email: "asantosma@unal.edu.co" },
  { id: "40987816", nombre: "Liza Hayes Mathias", email: "lhayesm@unal.edu.co" },
  { id: "52189598", nombre: "Angelica Piedad Ayala De La Hoz", email: "apayalad@unal.edu.co" },
  { id: "73569871", nombre: "Raul Roman Romero", email: "rromanr@unal.edu.co" },
  { id: "52424848", nombre: "Johannie Lucia James Cruz", email: "jljamesc@unal.edu.co" },
  { id: "79244154", nombre: "Jairo Humberto Medina Calderon", email: "jhmedinac@unal.edu.co" },
  { id: "52023234", nombre: "Juanita Montoya Galvis", email: "jmontoyaga@unal.edu.co" },
  { id: "123", nombre: "Melany Franco", email: "mefrancom@unal.edu.co" },
  { id: "1234", nombre: "Marycielo Berrio", email: "mberrioz@unal.edu.co" },
  { id: "12345", nombre: "Nestor Augusto Tocancipa", email: "natocancipag@unal.edu.co" }
];

const courses = [
    { id: "1000009-M", nombre: "BIOLOGÍA GENERAL", grupo: "CARI-01", sede: "Caribe" },
    { id: "1000001-M", nombre: "MATEMÁTICAS BÁSICAS", grupo: "CARI-02", sede: "Caribe" },
    { id: "1000002-M", nombre: "LECTO-ESCRITURA", grupo: "CARI-04", sede: "Caribe" },
    { id: "8000150", nombre: "LA DIMENSIÓN CARIBE DE LA NACIÓN COLOMBIANA", grupo: "1", sede: "Caribe" },
    { id: "4100539", nombre: "FUNDAMENTOS DE ECONOMÍA", grupo: "CARI-01", sede: "Caribe" },
    { id: "1000001-Z", nombre: "MATEMÁTICAS BÁSICAS", grupo: "CARI-02", sede: "Bogotá" },
    { id: "1000002-Z", nombre: "LECTO-ESCRITURA", grupo: "CARI-02", sede: "Bogotá" },
    { id: "1000089-C", nombre: "Cátedra nacional de inducción y preparación para la vida universitaria", grupo: "CARI-02", sede: "Bogotá" },
    { id: "2016082", nombre: "Problemas contemporáneos de las artes", grupo: "CARI-01", sede: "Caribe" },
    { id: "666", nombre: "catedra de prueba", grupo: "CARI-01", sede: "Bogotá" }
  ];
  

const periods = [
  { id: "2023-1", nombre: "2023-1" },
  { id: "2023-2", nombre: "2023-2" },
  { id: "2024-1", nombre: "2024-1" }
];

const sedes = [
  { id: "Caribe", nombre: "Caribe" },
  { id: "Bogotá", nombre: "Bogotá" }
];

const questions = [
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
        factor: 3,
        tipoRespuesta: tiposRespuesta.FRECUENCIA
      },
      {
        id: 15,
        texto: "¿Las evaluaciones hechas por el docente lo condujeron a mejorar su aprendizaje?",
        factor: 3,
        tipoRespuesta: tiposRespuesta.FRECUENCIA
      },
      {
        id: 16,
        texto: "¿Los resultados de las evaluaciones fueron un reflejo adecuado de su aprendizaje?",
        factor: 3,
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
        factor: 3,
        tipoRespuesta: tiposRespuesta.ABIERTA
      }
];

const studentCourses = [
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
    { studentId: "123", courseId: "666", teacherId: "123", group: "CARI-01", period: "2023-2" },
    { studentId: "1234", courseId: "1000009-M", teacherId: "51709551", group: "CARI-01", period: "2023-2" },
    { studentId: "1234", courseId: "1000001-M", teacherId: "40987816", group: "CARI-02", period: "2023-2" },
    { studentId: "1234", courseId: "1000002-M", teacherId: "52189598", group: "CARI-04", period: "2023-2" },
    { studentId: "1234", courseId: "8000150", teacherId: "51709551", group: "1", period: "2023-2" },
    { studentId: "1234", courseId: "666", teacherId: "1234", group: "CARI-01", period: "2023-2" },
    { studentId: "12345", courseId: "1000009-M", teacherId: "51709551", group: "CARI-01", period: "2023-2" },
    { studentId: "12345", courseId: "1000001-M", teacherId: "40987816", group: "CARI-02", period: "2023-2" },
    { studentId: "12345", courseId: "1000002-M", teacherId: "52189598", group: "CARI-04", period: "2023-2" },
    { studentId: "12345", courseId: "8000150", teacherId: "51709551", group: "1", period: "2023-2" },
    { studentId: "12345", courseId: "666", teacherId: "12345", group: "CARI-01", period: "2023-2" },
];

// 🔸 Función para subir todos los datos
export const uploadInitialData = async () => {
  try {
    for (const s of students) {
      await setDoc(doc(db2, 'students', s.id), s);
    }
    for (const t of teachers) {
      await setDoc(doc(db2, 'teachers', t.id), t);
    }
    for (const c of courses) {
      await setDoc(doc(db2, 'courses', c.id), c);
    }
    for (const q of questions) {
      await setDoc(doc(db2, 'questions', q.id.toString()), q);
    }
    for (const p of periods) {
      await setDoc(doc(db2, 'periods', p.id), p);
    }
    for (const sc of studentCourses) {
      const key = `${sc.studentId}_${sc.courseId}_${sc.teacherId}_${sc.period}`;
      await setDoc(doc(db2, 'studentCourses', key), sc);
    }

    console.log("✅ Todos los datos fueron subidos a Firestore.");
  } catch (error) {
    console.error("❌ Error al subir los datos:", error);
  }
};
