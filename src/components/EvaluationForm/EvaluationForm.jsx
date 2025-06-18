import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import './evaluationForm.css';

function EvaluationForm({ studentId, teacherId, courseId, periodId, onComplete }) {
  const { questions, addResponse } = useContext(AppContext);
  const [answers, setAnswers] = useState([]);
  
  // Verificar que questions existe antes de usar map
  const questionsArray = questions || [];
  
  // Inicializar respuestas sin valor predeterminado para que ninguna opción esté seleccionada
  useEffect(() => {
    if (questionsArray.length > 0) {
      setAnswers(new Array(questionsArray.length).fill(null));
    }
  }, [questionsArray]);
  
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar que todas las preguntas tienen respuesta (no son null)
    const allQuestionsAnswered = answers.every((answer, index) => {
      const question = questionsArray[index];
      // Para preguntas abiertas, verificar que no esté vacío
      if (question.tipoRespuesta === 'abierta') {
        return answer !== null && answer.trim() !== '';
      }
      return answer !== null;
    });
    
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
  
  // Función para renderizar las opciones de respuesta según el tipo
  const renderResponseOptions = (question, index) => {
    // Si es formato antiguo (string), mostrar escala del 1-5
    if (typeof question === 'string') {
      return (
        <div className="rating-container">
          {[1, 2, 3, 4, 5].map((value) => (
            <label 
              key={value} 
              className={`rating-label ${answers[index] === value ? 'seleccionada-pregunta' : ''}`}
            >
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
      );
    }
    
    // Para el nuevo formato con tipos de respuesta
    switch (question.tipoRespuesta) {
      case 'abierta':
        return (
          <div className="open-question-container">
            <textarea
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder="Escriba su respuesta aquí..."
              required
              rows={4}
              className="open-question-textarea"
            />
          </div>
        );
      
      case 'binaria':
        return (
          <div className="rating-container binaria">
            <label className={`rating-label ${answers[index] === 1 ? 'seleccionada-pregunta' : ''}`}>
              <input
                type="radio"
                name={`question-${index}`}
                value="1"
                checked={answers[index] === 1}
                onChange={() => handleAnswerChange(index, 1)}
                required
              />
              No
            </label>
            <label className={`rating-label ${answers[index] === 5 ? 'seleccionada-pregunta' : ''}`}>
              <input
                type="radio"
                name={`question-${index}`}
                value="5"
                checked={answers[index] === 5}
                onChange={() => handleAnswerChange(index, 5)}
                required
              />
              Sí
            </label>
          </div>
        );
      
      case 'frecuencia':
        return (
          <div className="rating-container frecuencia">
            {[
              { value: 1, label: 'Nunca' },
              { value: 2, label: 'A veces' },
              { value: 3, label: 'Frecuentemente' },
              { value: 5, label: 'Siempre' }
            ].map((option) => (
              <label 
                key={option.value} 
                className={`rating-label ${answers[index] === option.value ? 'seleccionada-pregunta' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option.value}
                  checked={answers[index] === option.value}
                  onChange={() => handleAnswerChange(index, option.value)}
                  required
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      
      case 'frecuencia_na':
        return (
          <div className="rating-container frecuencia-na">
            {[
              { value: 1, label: 'Nunca' },
              { value: 2, label: 'A veces' },
              { value: 3, label: 'Frecuentemente' },
              { value: 5, label: 'Siempre' },
              { value: 0, label: 'No aplica' }
            ].map((option) => (
              <label 
                key={option.value} 
                className={`rating-label ${answers[index] === option.value ? 'seleccionada-pregunta' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option.value}
                  checked={answers[index] === option.value}
                  onChange={() => handleAnswerChange(index, option.value)}
                  required
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      
      case 'valoracion':
        return (
          <div className="rating-container valoracion">
            {[
              { value: 1, label: 'Muy bajo' },
              { value: 2, label: 'Bajo' },
              { value: 4, label: 'Alto' },
              { value: 5, label: 'Muy alto' }
            ].map((option) => (
              <label 
                key={option.value} 
                className={`rating-label ${answers[index] === option.value ? 'seleccionada-pregunta' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option.value}
                  checked={answers[index] === option.value}
                  onChange={() => handleAnswerChange(index, option.value)}
                  required
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      
      default:
        // Por defecto, mostrar escala del 1-5
        return (
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((value) => (
              <label 
                key={value} 
                className={`rating-label ${answers[index] === value ? 'seleccionada-pregunta' : ''}`}
              >
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
        );
    }
  };
  
  return (
    <form className="evaluation-form" onSubmit={handleSubmit}>
      <div className="questions-container">
        {questionsArray
          .sort((a, b) => {
            // Ordenar por factor (primero factor 1, luego 2, etc.)
            const factorA = typeof a === 'string' ? 1 : a.factor;
            const factorB = typeof b === 'string' ? 1 : b.factor;
            return factorA - factorB;
          })
          .map((question, index) => (
          <div key={index} className="question-item">
            <p className="question-text">
              {typeof question === 'string' ? question : question.texto}
            </p>
            {renderResponseOptions(question, index)}
          </div>
        ))}
      </div>
      
      <button type="submit" className="submit-button" onClick={handleSubmit}>
        Enviar Evaluación
      </button>
    </form>
  );
}

export default EvaluationForm;