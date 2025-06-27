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
    setCurrentPeriod,
    currentSede,
    setCurrentSede,
    areResultsPublishedForPeriod
  } = useContext(AppContext);

  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [responses, setResponses] = useState([]);
  const [results, setResults] = useState({});
  const [courseResults, setCourseResults] = useState([]);
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [resultsPublished, setResultsPublished] = useState(false);
  const availableSedes = ['Bogotá', 'Caribe'];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const teacher = teachers.find(t => t.email === currentUser.email);
    if (!teacher) {
      navigate('/login');
      return;
    }

    setTeacherInfo(teacher);

    const teacherPeriodsIds = [...new Set(
      studentCourses
        .filter(sc => sc.teacherId === teacher.id)
        .map(sc => sc.period)
    )];

    const filteredPeriods = periods.filter(period =>
      teacherPeriodsIds.includes(period.id)
    );
    setAvailablePeriods(filteredPeriods);

    if (filteredPeriods.length > 0) {
      const isCurrentPeriodAvailable = filteredPeriods.some(p => p.id === currentPeriod);
      const periodToUse = isCurrentPeriodAvailable ? currentPeriod : filteredPeriods[0].id;
      setCurrentPeriod(periodToUse);
    }
  }, [currentUser, teachers, studentCourses, periods, currentPeriod, navigate, setCurrentPeriod]);

  useEffect(() => {
    const fetchData = async () => {
      if (!teacherInfo || !currentPeriod || !currentSede) return;

      try {
        const snapshot = await getDocs(collection(db2, 'results'));
        const fetchedResponses = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(r =>
            r.periodId === currentPeriod &&
            r.sede === currentSede &&
            r.teacherId === teacherInfo.id
          );
        setResponses(fetchedResponses);

        const resultsSnap = await getDoc(doc(db2, 'resultsForm', `${currentPeriod}_${currentSede}`));
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
  }, [teacherInfo, currentPeriod, currentSede]);

  useEffect(() => {
    if (!teacherInfo || !currentPeriod) return;

    const teacherCoursesIds = studentCourses
      .filter(sc => sc.teacherId === teacherInfo.id && sc.period === currentPeriod)
      .map(sc => sc.courseId);

    const uniqueCourseNames = [];
    teacherCoursesIds.forEach(courseId => {
      const c = courses.find(c => c.id === courseId);
      if (c && !uniqueCourseNames.includes(c.nombre)) {
        uniqueCourseNames.push(c.nombre);
      }
    });
    setTeacherCourses(uniqueCourseNames);
  }, [teacherInfo, currentPeriod, studentCourses, courses]);

  useEffect(() => {
    if (!responses.length || !teacherInfo) {
      setCourseResults([]);
      return;
    }

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

  const exportToExcel = () => {
    if (!courseResults.length || !teacherInfo) return;

    const wb = XLSX.utils.book_new();

    courseResults.forEach(course => {
      const data = [
        ['Docente', teacherInfo.nombre],
        ['Periodo', currentPeriod],
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

    XLSX.writeFile(wb, `Resultados_${teacherInfo.nombre.replace(/[^a-z0-9]/gi, '_')}_${currentPeriod}.xlsx`);
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
          selectedPeriod={currentPeriod}
          onSelectPeriod={setCurrentPeriod}
          label="Seleccione el periodo académico:"
        />

        <div style={{ margin: '1rem 0' }}>
          <label><strong>Seleccione la sede:</strong></label>
          <select
            value={currentSede || ''}
            onChange={(e) => setCurrentSede(e.target.value)}
            style={{ marginLeft: '1rem' }}
          >
            <option value="">-- Seleccione una sede --</option>
            {availableSedes.map(sede => (
              <option key={sede} value={sede}>{sede}</option>
            ))}
          </select>
        </div>

        <div className="teacher-info">
          <h3>Información del Docente</h3>
          <p><strong>ID:</strong> {teacherInfo.id}</p>
          <p><strong>Email:</strong> {teacherInfo.email}</p>
          <p><strong>Periodo:</strong> {periods.find(p => p.id === currentPeriod)?.nombre || 'No seleccionado'}</p>
          <p><strong>Asignaturas:</strong> {teacherCourses.length > 0 ? teacherCourses.join(', ') : 'No hay asignaturas asignadas para este periodo'}</p>
        </div>

        {resultsPublished ? (
          <div className="teacher-results">
            <h3>Resultados de su Evaluación - Periodo {currentPeriod}</h3>
            {courseResults.length > 0 ? (
              <>
                <button className="btn-success" style={{ marginBottom: '1rem' }} onClick={exportToExcel}>
                  Descargar Excel
                </button>
                <div className="results-card">
                  <ResultadosEncuesta
                    teacherId={teacherInfo.id}
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
            <p>Los resultados de la evaluación para el periodo {currentPeriod} aún no han sido publicados.</p>
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
