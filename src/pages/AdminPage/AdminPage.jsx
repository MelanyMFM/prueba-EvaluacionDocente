import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import EncuestaTab from "../../components/AdminTabs/EncuestaTab/EncuestaTab";
import PreguntasTab from '../../components/AdminTabs/PreguntasTab/PreguntasTab';
import ResultadosTab from '../../components/AdminTabs/ResultadosTab/ResultadosTab';
import ProgramacionTab from "../../components/AdminTabs/ProgramacionTab/ProgramacionTab";
import PeriodSelector from "../../components/PeriodSelector";
import './adminPage.css';

import { setDoc, doc, collection, query, where, getDoc } from 'firebase/firestore';
import { db2 } from '../../firebaseApp2';

function AdminPage() {
  const navigate = useNavigate();
  const {
    encuestaActiva,
    toggleEncuestaActivaForPeriod,
    questions,
    setQuestions,
    questionWeights,
    setQuestionWeights,
    resultsPublished,
    publishResults,
    responses,
    results,
    periods,
    currentPeriod,
    setCurrentPeriod,
    studentCourses,
    courses,
    currentSede,
    setCurrentSede,
    setPeriods
  } = useContext(AppContext);

  const sedesDisponibles = ['Caribe', 'Bogotá'];
  const [activeTab, setActiveTab] = useState('encuesta');
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod || (periods.length > 0 ? periods[0].id : null));
  const [selectedSede, setSelectedSede] = useState(currentSede);

  const [nuevoPeriodoId, setNuevoPeriodoId] = useState('');
  const [crearError, setCrearError] = useState(null);
  const [crearExito, setCrearExito] = useState(null);

  const [creandoPeriodo, setCreandoPeriodo] = useState(false);

  const crearNuevoPeriodo = async () => {
    setCrearError(null);
    setCrearExito(null);
  
    const trimmedId = nuevoPeriodoId.trim();
  
    if (!trimmedId) {
      setCrearError('Debe ingresar el ID del periodo.');
      return;
    }
  
    if (creandoPeriodo) return; // 🔒 Previene múltiples ejecuciones
  
    setCreandoPeriodo(true);
  
    try {
      const docRef = doc(db2, 'periods', trimmedId);
      const existingDoc = await getDoc(docRef);
  
      if (existingDoc.exists()) {
        setCrearError('El periodo con ese ID ya existe.');
        setCreandoPeriodo(false);
        return;
      }
  
      await setDoc(docRef, {
        id: trimmedId,
        nombre: trimmedId
      });
  
 
      setPeriods(prev => [...prev, { id: trimmedId, nombre: trimmedId }]);
  
      setCrearExito(`Periodo creado exitosamente con ID: ${trimmedId}`);
      setNuevoPeriodoId('');
    } catch (error) {
      console.error('Error al crear periodo:', error);
      setCrearError('Ocurrió un error al crear el periodo.');
    } finally {
      setCreandoPeriodo(false);
    }
  };
  

  useEffect(() => {
    if (currentPeriod !== selectedPeriod) {
      setSelectedPeriod(currentPeriod);
    }
  }, [currentPeriod]);

  useEffect(() => {
    if (setCurrentSede) {
      setCurrentSede(selectedSede);
    }
  }, [selectedSede, setCurrentSede]);

  const handlePeriodChange = (periodId) => {
    setSelectedPeriod(periodId);
    setCurrentPeriod(periodId);
  };

  const handleSedeChange = (sede) => {
    setSelectedSede(sede);
  };

  const isEncuestaActiva = () => {
    if (!selectedPeriod || !encuestaActiva) return false;
    return encuestaActiva[selectedSede] === true;
  };

  const isResultsPublished = () => {
    if (!selectedPeriod || !resultsPublished) return false;
    return resultsPublished[selectedSede] === true;
  };

  const handleToggleEncuesta = () => {
    toggleEncuestaActivaForPeriod(selectedPeriod, selectedSede, !isEncuestaActiva());
  };

  const handlePublishResults = () => {
    publishResults();
  };

  const filteredResponses = responses.filter(r => {
    const enrollment = studentCourses.find(
      sc => sc.studentId === r.studentId &&
            sc.teacherId === r.teacherId &&
            sc.courseId === r.courseId &&
            sc.period === selectedPeriod
    );
    if (!enrollment) return false;

    const course = courses.find(c => c.id === enrollment.courseId);
    return course?.sede === selectedSede;
  });

  const resultsKey = `${selectedPeriod}_${selectedSede}`;
  const resultsForPeriod = results[resultsKey] || {};

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>

      <div className="selectors-container">
        <PeriodSelector 
          periods={periods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={handlePeriodChange}
          label="Seleccione el periodo académico:"
        />

        <div className="sede-selector">
          <label><strong>Seleccione la sede:</strong></label>
          <select
            value={selectedSede}
            onChange={(e) => handleSedeChange(e.target.value)}
          >
            {sedesDisponibles.map(sede => (
              <option key={sede} value={sede}>{sede}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'encuesta' ? 'active' : ''} onClick={() => setActiveTab('encuesta')}>
          Estado de la Encuesta
        </button>
        <button className={activeTab === 'preguntas' ? 'active' : ''} onClick={() => setActiveTab('preguntas')}>
          Preguntas
        </button>
        <button className={activeTab === 'resultados' ? 'active' : ''} onClick={() => setActiveTab('resultados')}>
          Resultados
        </button>
        <button className={activeTab === 'crearPeriodo' ? 'active' : ''} onClick={() => setActiveTab('crearPeriodo')}>
          Crear Periodo Académico
        </button>
        <button className={activeTab === 'programacion' ? 'active' : ''} onClick={() => setActiveTab('programacion')}>
          Programación Académica
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'encuesta' && (
          <EncuestaTab 
            encuestaActiva={isEncuestaActiva()} 
            setEncuestaActiva={handleToggleEncuesta} 
            currentSede={selectedSede}
          />
        )}

        {activeTab === 'preguntas' && (
          <PreguntasTab />
        )}

        {activeTab === 'crearPeriodo' && (
          <div className="crear-periodo">
            <h3>Crear Nuevo Periodo Académico</h3>
            <input
              type="text"
              placeholder="ID del periodo (ej: 2025-1)"
              value={nuevoPeriodoId}
              onChange={(e) => setNuevoPeriodoId(e.target.value)}
            />
            <button onClick={crearNuevoPeriodo}>Crear Periodo</button>

            {crearError && <p className="error-message">{crearError}</p>}
            {crearExito && <p className="success-message">{crearExito}</p>}
          </div>
        )}

        {activeTab === 'resultados' && (
          <ResultadosTab />
        )}

        {activeTab === 'programacion' && (
          <ProgramacionTab selectedPeriod={selectedPeriod} />
        )}
      </div>

      <button onClick={() => navigate('/')} className="back-button">
        Volver al Inicio
      </button>
    </div>
  );
}

export default AdminPage;
