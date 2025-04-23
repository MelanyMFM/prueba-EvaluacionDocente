import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function EstudiantePage(){
  const {
    isSurveyActive,
    questions,
    responses,
    setResponses
  } = useAppContext();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));

  function handleLogin(e){
    e.preventDefault();
    if (studentId.trim()) {
      setIsAuthenticated(true);
    }
  };

  function handlePregunta(index, value){
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };

  function handleEnviar(){
    if (answers.some(a => a === 0)) {
      alert("responder todas las preguntas");
      return;
    }
    setResponses(prev => ({ ...prev, [studentId]: answers }));
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Ingreso de Estudiante</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>ID de Estudiante: </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    );
  }

  if (!isSurveyActive) {
    return <h2>La encuesta está desactivada</h2>;
  }

  if (responses[studentId]) {
    return <h2>Ya respondio la encuesta</h2>;
  }

  return (
    <div>
      <h2>Encuesta de Evaluación Docente</h2>
      <p>Estudiante: {studentId}</p>
      {questions.map((q, idx) => (
        <div key={idx}>
          <p>{q}</p>
          <select 
            value={answers[idx]} 
            onChange={(e) => handlePregunta(idx, e.target.value)}
          >
            <option value={0}>Selecciona una opción</option>
            <option value={1}>1 - Muy mal</option>
            <option value={2}>2 - Mal</option>
            <option value={3}>3 - Regular</option>
            <option value={4}>4 - Bien</option>
            <option value={5}>5 - Excelente</option>
          </select>
        </div>
      ))}
      <button onClick={handleEnviar}>Enviar Encuesta</button>
    </div>
  );
};

export default EstudiantePage;
