import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

const AdminPage = () => {
  const {
    isSurveyActive,
    setIsSurveyActive,
    questions,
    setQuestions,
    surveyWeight,
    setSurveyWeight,
    responses,
    finalScores,
    setFinalScores,
    resultsPublished,
    setResultsPublished,
    questionWeights,
    setQuestionWeights
  } = useAppContext();
  

  const [editedQuestions, setEditedQuestions] = useState(questions);
  const [localWeight, setLocalWeight] = useState(surveyWeight);

  const toggleSurvey = () => {
    setIsSurveyActive(prev => !prev);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...editedQuestions];
    newQuestions[index] = value;
    setEditedQuestions(newQuestions);
  };

  const saveChanges = () => {
    setQuestions(editedQuestions);
    setSurveyWeight(localWeight);
    alert("Cambios guardados");
  };

  const calculateResults = () => {
    if (resultsPublished) {
      alert("Los resultados ya fueron calculados.");
      return;
    }
  
    let total = 0;
    let cantidad = 0;
  
    Object.values(responses).forEach(resp => {
      // resp es un arreglo de respuestas del estudiante (de 0 a 5)
      let notaEstudiante = 0;
  
      for (let i = 0; i < resp.length; i++) {
        notaEstudiante += resp[i] * questionWeights[i];
      }
  
      total += notaEstudiante;
      cantidad++;
    });
  
    const promedio = cantidad > 0 ? total / cantidad : 0;
    const notaFinal = parseFloat(((promedio * surveyWeight) / 100).toFixed(2));
  
    setFinalScores({ docente1: notaFinal });
    setResultsPublished(true);
    setIsSurveyActive(false);
    alert("Resultados calculados y publicados");
  };
  

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel del Administrador</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Estado de la encuesta</h3>
        <p>Encuesta actualmente: <strong>{isSurveyActive ? 'Activa' : 'Inactiva'}</strong></p>
        <button onClick={toggleSurvey}>
          {isSurveyActive ? 'Desactivar' : 'Activar'} Encuesta
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Editar preguntas</h3>

        
        {editedQuestions.map((q, idx) => (
  <div key={idx} style={{ marginBottom: '10px' }}>
    <label>Pregunta {idx + 1}: </label>
    <input
      type="text"
      value={q}
      onChange={(e) => handleQuestionChange(idx, e.target.value)}
      style={{ marginRight: '10px' }}
    />
    <label>Peso: </label>
    <input
      type="number"
      step="0.1"
      value={questionWeights[idx]}
      onChange={(e) => {
        const newWeights = [...questionWeights];
        newWeights[idx] = parseFloat(e.target.value);
        setQuestionWeights(newWeights);
      }}
    />
  </div>
))}

      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Valor de la encuesta en la nota final (%)</h3>
        <input
          type="number"
          value={localWeight}
          onChange={(e) => setLocalWeight(parseInt(e.target.value))}
        />
      </div>

      <button onClick={saveChanges} style={{ marginRight: '10px' }}>Guardar Cambios</button>
      <button onClick={calculateResults}>Calcular Resultados</button>

      {resultsPublished && (
        <div style={{ marginTop: '20px' }}>
          <h3>Resultados publicados</h3>
          <p>Docente 1 - Nota: <strong>{finalScores.docente1}</strong></p>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
