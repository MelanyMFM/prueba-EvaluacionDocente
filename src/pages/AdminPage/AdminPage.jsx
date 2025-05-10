import React, { useState, useContext } from 'react';
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
    isEncuestaActivaForPeriod,
    areResultsPublishedForPeriod,
    studentCourses
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('encuesta');
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);

  // Manejar cambio de periodo
  const handlePeriodChange = (periodId) => {
    setSelectedPeriod(periodId);
    setCurrentPeriod(periodId);
  };

  // Verificar si la encuesta está activa para el periodo seleccionado
  const isEncuestaActiva = selectedPeriod ? isEncuestaActivaForPeriod(selectedPeriod) : false;

  // Función para activar/desactivar la encuesta para el periodo seleccionado
  const handleToggleEncuesta = () => {
    toggleEncuestaActivaForPeriod(selectedPeriod, !isEncuestaActiva);
  };

  // Verificar si los resultados están publicados para el periodo seleccionado
  const isResultsPublished = selectedPeriod ? areResultsPublishedForPeriod(selectedPeriod) : false;

  // Función para publicar resultados para el periodo seleccionado
  const handlePublishResults = () => {
    publishResults(selectedPeriod);
  };

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>
      
      <PeriodSelector 
        periods={periods}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={handlePeriodChange}
        label="Seleccione el periodo académico:"
      />
      
      <div className="admin-tabs">
        <button
          className={activeTab === 'encuesta' ? 'active' : ''}
          onClick={() => setActiveTab('encuesta')}
        >
          Estado de la Encuesta
        </button>
        <button
          className={activeTab === 'preguntas' ? 'active' : ''}
          onClick={() => setActiveTab('preguntas')}
        >
          Preguntas
        </button>
        <button
          className={activeTab === 'resultados' ? 'active' : ''}
          onClick={() => setActiveTab('resultados')}
        >
          Resultados
        </button>
        <button
          className={activeTab === 'programacion' ? 'active' : ''}
          onClick={() => setActiveTab('programacion')}
        >
          Programación Académica
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'encuesta' && (
          <EncuestaTab 
            encuestaActiva={isEncuestaActiva} 
            setEncuestaActiva={handleToggleEncuesta} 
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
            resultsPublished={isResultsPublished}
            publishResults={handlePublishResults}
            responses={responses.filter(r => {
              // Filtrar respuestas por periodo
              const enrollment = studentCourses.find(
                sc => sc.studentId === r.studentId && 
                      sc.teacherId === r.teacherId && 
                      sc.courseId === r.courseId
              );
              return enrollment && enrollment.period === selectedPeriod;
            })}
            results={results[selectedPeriod] || {}}
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
