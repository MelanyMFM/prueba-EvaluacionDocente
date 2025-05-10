import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import './evaluationForm.css';

function EvaluationForm({ studentId, teacherId, courseId, periodId, onComplete }) {
  const { questions, addResponse } = useContext(AppContext);
  const [answers, setAnswers] = useState([]);
  
  // Verificar que questions existe antes de usar map
  const questionsArray = questions || [];
  
  // Inicializar respuestas con valores predeterminados (0)
  React.useEffect(() => {
    if (questionsArray.length > 0) {
      setAnswers(new Array(questionsArray.length).fill(0));
    }
  }, [questionsArray]);
  
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar que todas las preguntas tienen respuesta
    const allQuestionsAnswered = answers.every(answer => answer > 0);
    
    if (!allQuestionsAnswered) {
      alert('Por favor, responda todas las preguntas');
      return;
    }
    
    // Crear objeto de respuesta
    const response = {
      studentId,
      teacherId,
      courseId,
      periodId,
      answers,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Agregar respuesta al contexto
      addResponse(response);
      
      // Notificar al componente padre que se completó la evaluación con éxito
      onComplete({ success: true, response });
    } catch (error) {
      console.error("Error al guardar la respuesta:", error);
      onComplete({ success: false, error });
    }
  };
  
  return (
    <form className="evaluation-form" onSubmit={handleSubmit}>
      <div className="questions-container">
        {questionsArray.map((question, index) => (
          <div key={index} className="question-item">
            <p className="question-text">{question}</p>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="rating-label">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={value}
                    checked={answers[index] === value}
                    onChange={() => handleAnswerChange(index, value)}
                    required
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <button type="submit" className="submit-button">
        Enviar Evaluación
      </button>
    </form>
  );
}

export default EvaluationForm;