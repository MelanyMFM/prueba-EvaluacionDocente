import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import EncuestaTab from "../../components/AdminTabs/EncuestaTab/EncuestaTab";
import PreguntasTab from '../../components/AdminTabs/PreguntasTab/PreguntasTab';
import ResultadosTab from '../../components/AdminTabs/ResultadosTab/ResultadosTab';
import ProgramacionTab from "../../components/AdminTabs/ProgramacionTab/ProgramacionTab";
import PeriodSelector from "../../components/PeriodSelector";
import './adminPage.css';

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
    setCurrentSede // opcional si deseas sincronizar la sede seleccionada
  } = useContext(AppContext);

  const sedesDisponibles = ['Caribe', 'Bogotá'];
  const [activeTab, setActiveTab] = useState('encuesta');
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod || (periods.length > 0 ? periods[0].id : null));
  const [selectedSede, setSelectedSede] = useState(currentSede); // nuevo estado

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
    publishResults(); // asume que usa currentPeriod y currentSede
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
          <PreguntasTab 
            questions={questions}
            setQuestions={setQuestions}
            questionWeights={questionWeights}
            setQuestionWeights={setQuestionWeights}
          />
        )}

        {activeTab === 'resultados' && (
          <ResultadosTab 
            resultsPublished={isResultsPublished()}
            publishResults={handlePublishResults}
            responses={filteredResponses}
            results={resultsForPeriod}
          />
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
