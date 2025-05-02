import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import EncuestaTab from "../../components/AdminTabs/EncuestaTab/EncuestaTab";
import PreguntasTab from '../../components/AdminTabs/PreguntasTab/PreguntasTab';
import ResultadosTab from '../../components/AdminTabs/ResultadosTab/ResultadosTab';
import ProgramacionTab from "../../components/AdminTabs/ProgramacionTab/ProgramacionTab";
import './adminPage.css';

function AdminPage() {
  const navigate = useNavigate();
  const {
    encuestaActiva,
    setEncuestaActiva,
    questions,
    setQuestions,
    questionWeights,
    setQuestionWeights,
    resultsPublished,
    publishResults,
    responses,
    results
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('encuesta');

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>
      
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
            encuestaActiva={encuestaActiva} 
            setEncuestaActiva={setEncuestaActiva} 
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
            resultsPublished={resultsPublished}
            publishResults={publishResults}
            responses={responses}
            results={results}
          />
        )}
        
        {activeTab === 'programacion' && (
          <ProgramacionTab />
        )}
      </div>
      
      <button onClick={() => navigate('/')} className="back-button">
        Volver al Inicio
      </button>
    </div>
  );
}

export default AdminPage;
