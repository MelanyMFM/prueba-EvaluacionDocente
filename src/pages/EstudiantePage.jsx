import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const EstudiantePage = () => {
  const {
    isSurveyActive,
    questions,
    responses,
    setResponses
  } = useAppContext();

  const estudianteId = 'mockEstudiante123'; // simulación sin login
  const yaRespondio = responses[estudianteId] !== undefined;

  const [answers, setAnswers] = useState(Array(questions.length).fill(0));

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.some(a => a === 0)) {
      alert("Debes responder todas las preguntas.");
      return;
    }
    setResponses(prev => ({ ...prev, [estudianteId]: answers }));
    alert("Encuesta enviada con éxito.");
  };

  if (!isSurveyActive) {
    return <h2>La encuesta no está disponible en este momento.</h2>;
  }

  if (yaRespondio) {
    return <h2>Ya has respondido esta encuesta. ¡Gracias por tu participación!</h2>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Encuesta Docente</h2>
      {questions.map((q, idx) => (
        <div key={idx} style={{ marginBottom: '15px' }}>
          <p>{q}</p>
          <select value={answers[idx]} onChange={(e) => handleAnswerChange(idx, e.target.value)}>
            <option value={0}>Selecciona una opción</option>
            <option value={1}>1 - Muy mal</option>
            <option value={2}>2 - Mal</option>
            <option value={3}>3 - Regular</option>
            <option value={4}>4 - Bien</option>
            <option value={5}>5 - Excelente</option>
          </select>
        </div>
      ))}
      <button onClick={handleSubmit}>Enviar Encuesta</button>
    </div>
  );
};

export default EstudiantePage;
