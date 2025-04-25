import { useAppContext } from '../../context/AppContext';
import { useState } from 'react';
import EstadoEncuesta from '../../components/EstadoEncuesta';
import EditorPreguntas from '../../components/EditorPreguntas';
import ResultadosEncuesta from '../../components/ResultadosEncuesta';
import './adminPage.css';

function AdminPage(){
  const {
    isSurveyActive,
    setIsSurveyActive,
    questions,
    setQuestions,
    responses,
    finalScores,
    setFinalScores,
    resultsPublished,
    setResultsPublished,
    questionWeights,
    setQuestionWeights
  } = useAppContext();
  
  const [editedQuestions, setEditedQuestions] = useState(questions);

  function toggleEncuesta(){
    setIsSurveyActive(estado => !estado);
  };

  function handleCambioPregunta(index, value) {
    const newQuestions = [...editedQuestions];
    newQuestions[index] = value;
    setEditedQuestions(newQuestions);
  };

  function handleCambioPeso(index, value){
    const nuevosPesos = [...pesos];
    nuevosPesos[index] = value;
    setQuestionWeights(nuevosPesos);
  };

  function guardarCambios(){
    setQuestions(editedQuestions);
    alert("Cambios guardados");
  };

  function calcularResultados(){
    if (resultsPublished) {
      alert("Ya se calcularon los resultados");
      return;
    }
  
    let total = 0;
    let cantidad = 0;
  
    Object.values(responses).forEach(resp => {
      let notaEstudiante = 0;
  
      for (let i = 0; i < resp.length; i++) {
        notaEstudiante += resp[i] * questionWeights[i];
      }
  
      total += notaEstudiante;
      cantidad++;
    });
  
    const promedio = cantidad > 0 ? total / cantidad : 0;
    const notaFinal = parseFloat((promedio / 5).toFixed(2));
  
    setFinalScores({ docente1: notaFinal });
    setResultsPublished(true);
    setIsSurveyActive(false);
  };

  return (
    <div>
      <h2>Admin</h2>

      <EstadoEncuesta 
        isSurveyActive={isSurveyActive} 
        onToggle={toggleEncuesta} 
      />

      <EditorPreguntas 
        questions={editedQuestions}
        weights={questionWeights}
        onQuestionChange={handleCambioPregunta}
        onWeightChange={handleCambioPeso}
      />

      <div>
        <button onClick={guardarCambios}>Guardar Cambios</button>
        <button 
          onClick={calcularResultados}
          disabled={resultsPublished || Object.keys(responses).length === 0}
        >
          Calcular Resultados
        </button>
      </div>

      {resultsPublished && (
        <ResultadosEncuesta 
          finalScores={finalScores}
          totalResponses={Object.keys(responses).length}
        />
      )}
    </div>
  );
};

export default AdminPage;
