// src/contexts/AppContext.js
import React, { createContext, useEffect, useState } from 'react';
import { db2 } from '../firebaseApp2';
import {
  collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc
} from 'firebase/firestore';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [periods, setPeriods] = useState([]);

  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [currentSede, setCurrentSede] = useState("Caribe");

  const [encuestaActiva, setEncuestaActiva] = useState({});
  const [resultsPublished, setResultsPublished] = useState({});
  const [results, setResults] = useState({});
  const [responses, setResponses] = useState([]);

  const [preguntas, setPreguntas] = useState([]);

  const tiposRespuesta = {
    BINARIA: "binaria",
    FRECUENCIA: "frecuencia",
    FRECUENCIA_NA: "frecuencia_na",
    VALORACION: "valoracion",
    ABIERTA: "abierta"
  };

  const factoresDisponibles = [
    { id: 1, nombre: "Factor 1" },
    { id: 2, nombre: "Factor 2" },
    { id: 3, nombre: "Factor 3" }
  ];

  // Cargar datos desde Firebase al inicio
  useEffect(() => {
    const loadData = async () => {
      const loadCollection = async (name) => {
        const snapshot = await getDocs(collection(db2, name));
        return snapshot.docs.map(doc => doc.data());
      };

      setStudents(await loadCollection("students"));
      setTeachers(await loadCollection("teachers"));
      setCourses(await loadCollection("courses"));
      setQuestions(await loadCollection("questions"));
      setStudentCourses(await loadCollection("studentCourses"));
      const loadedPeriods = await loadCollection("periods");
      setPeriods(loadedPeriods);
      setCurrentPeriod(loadedPeriods[0]?.id || null);
    };

    loadData();
  }, []);

  useEffect(() => {
    cargarPreguntas();
  }, []);
  

  // Cargar estado de encuesta activa y resultados publicados al cambiar periodo
  useEffect(() => {
    const fetchMetaStates = async () => {
      if (!currentPeriod) return;

      const encuestaSnap = await getDoc(doc(db2, "encuestaActiva", currentPeriod));
      if (encuestaSnap.exists()) {
        setEncuestaActiva(encuestaSnap.data());
      }

      const publishedSnap = await getDoc(doc(db2, "resultsPublished", currentPeriod));
      if (publishedSnap.exists()) {
        setResultsPublished(publishedSnap.data());
      }

      const resultsSnap = await getDoc(doc(db2, "results", `${currentPeriod}_${currentSede}`));
      if (resultsSnap.exists()) {
        setResults(resultsSnap.data());
      } else {
        setResults({});
      }
    };

    fetchMetaStates();
  }, [currentPeriod, currentSede]);

  // Cambiar estado de encuesta activa en Firestore
  const toggleEncuestaActivaForPeriod = async (periodId, sede, isActive) => {
    const ref = doc(db2, "encuestaActiva", periodId);
    const snapshot = await getDoc(ref);
    const current = snapshot.exists() ? snapshot.data() : {};
    await setDoc(ref, { ...current, [sede]: isActive });
    setEncuestaActiva(prev => ({ ...prev, [sede]: isActive }));
  };

  // Verifica si la encuesta está activa para la sede actual
  const isEncuestaActivaForCurrent = () => {
    return encuestaActiva?.[currentSede] === true;
  };

  // Cargar preguntas desde Firestore
const cargarPreguntas = async () => {
  try {
    const snapshot = await getDocs(collection(db2, 'questions'));
    const preguntasFirebase = snapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data()
    }));
    setPreguntas(preguntasFirebase);
  } catch (error) {
    console.error('Error cargando preguntas:', error);
  }
};

// Agregar nueva pregunta
const agregarPregunta = async (preguntaObj) => {
  try {
    await addDoc(collection(db2, 'questions'), preguntaObj);
    await cargarPreguntas();
  } catch (error) {
    console.error('Error agregando pregunta:', error);
  }
};

// Editar pregunta
const editarPregunta = async (id, datosActualizados) => {
  try {
    await updateDoc(doc(db2, 'questions', id), datosActualizados);
    await cargarPreguntas();
  } catch (error) {
    console.error('Error editando pregunta:', error);
  }
};

// Eliminar pregunta
const eliminarPregunta = async (id) => {
  try {
    await deleteDoc(doc(db2, 'questions', id));
    await cargarPreguntas();
  } catch (error) {
    console.error('Error eliminando pregunta:', error);
  }
};


  // Publicar resultados en Firestore
  const publishResults = async () => {
    const filteredResponses = responses.filter(r => {
      const sc = studentCourses.find(s =>
        s.studentId === r.studentId &&
        s.courseId === r.courseId &&
        s.teacherId === r.teacherId &&
        s.period === currentPeriod
      );
      const course = courses.find(c => c.id === sc?.courseId);
      return sc && course?.sede === currentSede;
    });

    const grouped = {};
    filteredResponses.forEach(res => {
      if (!grouped[res.teacherId]) {
        grouped[res.teacherId] = {
          responses: [],
          factores: {},
          promedioGeneral: 0
        };
      }
      grouped[res.teacherId].responses.push(res);
    });

    const resultados = {};

    Object.entries(grouped).forEach(([teacherId, { responses }]) => {
      const factoresData = {};
      factoresDisponibles.forEach(f => {
        factoresData[f.id] = {
          nombre: f.nombre,
          totalPuntos: 0,
          puntosMaximos: 0,
          promedio: 0
        };
      });

      responses.forEach(r => {
        r.answers.forEach((ans, idx) => {
          const q = questions[idx];
          if (!q || q.tipoRespuesta === tiposRespuesta.ABIERTA) return;
          const factor = q.factor;
          if (!factoresData[factor]) return;

          let puntos = 0, max = 4;

          switch (q.tipoRespuesta) {
            case tiposRespuesta.BINARIA: puntos = ans === 5 ? 4 : ans === 1 ? 2 : 0; break;
            case tiposRespuesta.FRECUENCIA:
            case tiposRespuesta.FRECUENCIA_NA: puntos = ans === 5 ? 4 : ans === 3 ? 3 : ans === 2 ? 1 : 0; break;
            case tiposRespuesta.VALORACION: puntos = ans === 5 ? 4 : ans === 4 ? 3 : ans === 2 ? 1 : 0; break;
          }

          factoresData[factor].totalPuntos += puntos;
          factoresData[factor].puntosMaximos += max;
        });
      });

      let total = 0, maxTotal = 0;
      Object.values(factoresData).forEach(f => {
        if (f.puntosMaximos > 0) {
          f.promedio = ((f.totalPuntos / f.puntosMaximos) * 5).toFixed(2);
          total += f.totalPuntos;
          maxTotal += f.puntosMaximos;
        }
      });

      const promedioGeneral = maxTotal > 0 ? ((total / maxTotal) * 5).toFixed(2) : "0.00";
      const teacher = teachers.find(t => t.id === teacherId);

      resultados[teacherId] = {
        nombre: teacher?.nombre || "Docente",
        factores: factoresData,
        promedioGeneral,
        periodo: currentPeriod,
        sede: currentSede
      };
    });

    const ref = doc(db2, "results", `${currentPeriod}_${currentSede}`);
    await setDoc(ref, resultados);
    setResults(resultados);

    const publishedRef = doc(db2, "resultsPublished", currentPeriod);
    const publishedSnap = await getDoc(publishedRef);
    const currentPub = publishedSnap.exists() ? publishedSnap.data() : {};
    await setDoc(publishedRef, { ...currentPub, [currentSede]: true });

    setResultsPublished(prev => ({ ...prev, [currentSede]: true }));
  };

  // Función para agregar una respuesta
  const addResponse = (r) => {
    setResponses(prev => [...prev, r]);
  };

  return (
    <AppContext.Provider value={{
      students, teachers, courses, questions, studentCourses, periods,
      currentPeriod, setCurrentPeriod,
      currentSede, setCurrentSede,
      responses, setResponses, addResponse,
      encuestaActiva, toggleEncuestaActivaForPeriod, isEncuestaActivaForCurrent,
      resultsPublished, results, publishResults,
      tiposRespuestaDisponibles: tiposRespuesta,
      factoresDisponibles,
      preguntas,
      cargarPreguntas,
      agregarPregunta,
      editarPregunta,
      eliminarPregunta,
    }}>
      {children}
    </AppContext.Provider>
  );
};
