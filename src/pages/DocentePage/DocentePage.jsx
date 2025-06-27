import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db2 } from '../../firebaseApp2';
import ResultadosEncuesta from '../../components/ResultadosEncuesta';
import PeriodSelector from '../../components/PeriodSelector';
import './docentePage.css';
import * as XLSX from 'xlsx';

function DocentePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    teachers, 
    studentCourses, 
    courses, 
    periods,
    currentPeriod,
    currentSede,
    setCurrentPeriod,
    areResultsPublishedForPeriod // si lo usas para algo más, si no puedes quitarlo
  } = useContext(AppContext);
  
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [responses, setResponses] = useState([]);
  const [results, setResults] = useState({});
  const [courseResults, setCourseResults] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [resultsPublished, setResultsPublished] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Obtener datos del docente según su email
    const teacher = teachers.find(t => t.email === currentUser.email);
    if (!teacher) {
      navigate('/login');
      return;
    }
    setTeacherInfo(teacher);

    // Obtener periodos en los que tiene cursos
    const teacherPeriodsIds = [...new Set(
      studentCourses
        .filter(sc => sc.teacherId === teacher.id)
        .map(sc => sc.period)
    )];

    const filteredPeriods = periods.filter(period => 
      teacherPeriodsIds.includes(period.id)
    );
    setAvailablePeriods(filteredPeriods);

    // Si el periodo actual no está disponible para el docente, elegir el primero
    if (filteredPeriods.length > 0) {
      const isCurrentPeriodAvailable = filteredPeriods.some(p => p.id === currentPeriod);
      const periodToUse = isCurrentPeriodAvailable ? currentPeriod : filteredPeriods[0].id;
      setSelectedPeriod(periodToUse);
      setCurrentPeriod(periodToUse);
    }
  }, [currentUser, teachers, studentCourses, periods, currentPeriod, navigate, setCurrentPeriod]);

  // Cargar respuestas y resultados cuando cambie selectedPeriod, teacherInfo o currentSede
  useEffect(() => {
    const fetchData = async () => {
      if (!teacherInfo || !selectedPeriod || !currentSede) return;

      try {
        // 1. Obtener respuestas filtradas por periodo, sede y docente
        const snapshot = await getDocs(collection(db2, 'results'));
        const fetchedResponses = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(r => 
            r.periodId === selectedPeriod && 
            r.sede === currentSede &&
            r.teacherId === teacherInfo.id
          );
        setResponses(fetchedResponses);

        // 2. Obtener resultados publicados para el periodo y sede
        const resultsSnap = await getDoc(doc(db2, 'resultsForm', `${selectedPeriod}_${currentSede}`));
        if (resultsSnap.exists()) {
          setResults(resultsSnap.data());
          setResultsPublished(true);
        } else {
          setResults({});
          setResultsPublished(false);
        }
      } catch (error) {
        console.error('Error al cargar respuestas o resultados:', error);
      }
    };

    fetchData();
  }, [teacherInfo, selectedPeriod, currentSede]);

  // Actualizar cursos del docente para el periodo seleccionado
  useEffect(() => {
    if (!teacherInfo || !selectedPeriod) return;

    const teacherCoursesIds = studentCourses
      .filter(sc => sc.teacherId === teacherInfo.id && sc.period === selectedPeriod)
      .map(sc => sc.courseId);

    const uniqueCourseNames = [];
    teacherCoursesIds.forEach(courseId => {
      const c = courses.find(c => c.id === courseId);
      if (c && !uniqueCourseNames.includes(c.nombre)) {
        uniqueCourseNames.push(c.nombre);
      }
    });
    setTeacherCourses(uniqueCourseNames);
  }, [teacherInfo, selectedPeriod, studentCourses, courses]);

  // Calcular resultados por asignatura con respuestas y resultados ya cargados
  useEffect(() => {
    if (!responses.length || !teacherInfo) {
      setCourseResults([]);
      return;
    }

    // Agrupar respuestas por curso y calcular promedios
    const courseResultsMap = {};

    responses.forEach(response => {
      if (!courseResultsMap[response.courseId]) {
        courseResultsMap[response.courseId] = {
          courseId: response.courseId,
          participaciones: 0,
          factores: {},
          promedioGeneral: 0,
        };
      }

      const entry = courseResultsMap[response.courseId];
      entry.participaciones += 1;

      const factores = response.factores || {};
      Object.entries(factores).forEach(([factorId, factor]) => {
        if (!entry.factores[factorId]) {
          entry.factores[factorId] = {
            nombre: factor.nombre || 'Factor desconocido',
            totalPuntaje: 0,
            totalPreguntas: 0,
            promedio: 0,
          };
        }
        entry.factores[factorId].totalPuntaje += factor.totalPuntaje || 0;
        entry.factores[factorId].totalPreguntas += factor.totalPreguntas || 0;
      });

      entry.promedioGeneral += parseFloat(response.promedioGeneral || 0);
    });

    const courseResultsArr = Object.values(courseResultsMap).map(course => {
      const courseInfo = courses.find(c => c.id === course.courseId) || { nombre: 'Curso desconocido' };

      Object.values(course.factores).forEach(factor => {
        factor.promedio = factor.totalPreguntas > 0
          ? (factor.totalPuntaje / factor.totalPreguntas).toFixed(2)
          : '0.00';
      });

      return {
        nombreAsignatura: courseInfo.nombre,
        participaciones: course.participaciones,
        factores: course.factores,
        promedioGeneral: course.participaciones > 0
          ? (course.promedioGeneral / course.participaciones).toFixed(2)
          : '0.00'
      };
    });

    setCourseResults(courseResultsArr);
  }, [responses, teacherInfo, courses]);

  // Cambio de periodo
  const handlePeriodChange = (periodId) => {
    setSelectedPeriod(periodId);
    setCurrentPeriod(periodId);
  };

  // Exportar resultados a Excel
  const exportToExcel = () => {
    if (!courseResults.length || !teacherInfo) return;

    const wb = XLSX.utils.book_new();

    courseResults.forEach(course => {
      const data = [
        ['Docente', teacherInfo.nombre],
        ['Periodo', selectedPeriod],
        ['Asignatura', course.nombreAsignatura],
        ['Participaciones', course.participaciones],
        ['Promedio General', course.promedioGeneral],
        [],
        ['Resultados por Factor'],
        ['Factor', 'Promedio']
      ];

      Object.values(course.factores).forEach(factor => {
        data.push([factor.nombre, factor.promedio]);
      });

      const sheetName = course.nombreAsignatura.substring(0, 31) || 'Asignatura';
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, `Resultados_${teacherInfo.nombre.replace(/[^a-z0-9]/gi, '_')}_${selectedPeriod}.xlsx`);
  };

  if (!currentUser || !teacherInfo) {
    return null;
  }

  return (
    <div className="docente-container">
      <h1>Portal Docente</h1>
      <div className="teacher-dashboard">
        <h2>Bienvenido(a), {teacherInfo.nombre}</h2>

        <PeriodSelector 
          periods={availablePeriods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={handlePeriodChange}
          label="Seleccione el periodo académico:"
        />

        <div className="teacher-info">
          <h3>Información del Docente</h3>
          <p><strong>ID:</strong> {teacherInfo.id}</p>
          <p><strong>Email:</strong> {teacherInfo.email}</p>
          <p><strong>Periodo:</strong> {periods.find(p => p.id === selectedPeriod)?.nombre || 'No seleccionado'}</p>
          <p><strong>Asignaturas:</strong> {teacherCourses.length > 0 ? teacherCourses.join(', ') : 'No hay asignaturas asignadas para este periodo'}</p>
        </div>

        {resultsPublished ? (
          <div className="teacher-results">
            <h3>Resultados de su Evaluación - Periodo {selectedPeriod}</h3>
            {courseResults.length > 0 ? (
              <>
                <button className="btn-success" style={{marginBottom: '1rem'}} onClick={exportToExcel}>
                  Descargar Excel
                </button>
                <div className="results-card">
                  <ResultadosEncuesta 
                    teacherName={teacherInfo.nombre}
                    courseResults={courseResults}
                    showTeacherName={false}
                  />
                </div>
              </>
            ) : (
              <p>No hay resultados disponibles para su evaluación en este periodo.</p>
            )}
          </div>
        ) : (
          <div className="no-results">
            <p>Los resultados de la evaluación para el periodo {selectedPeriod} aún no han sido publicados.</p>
            <p>Por favor, vuelva a consultar más tarde.</p>
          </div>
        )}

        <button onClick={() => navigate('/')} className="back-button">
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}

export default DocentePage;
