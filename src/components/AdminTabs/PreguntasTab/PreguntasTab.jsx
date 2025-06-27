import React, { useState, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import './preguntasTab.css';

function PreguntasTab({ questions, setQuestions, questionWeights, setQuestionWeights }) {
  const { factoresDisponibles, tiposRespuestaDisponibles } = useContext(AppContext);

  const [newQuestion, setNewQuestion] = useState('');
  const [newWeight, setNewWeight] = useState(10);
  const [newFactor, setNewFactor] = useState(1);
  const [newTipoRespuesta, setNewTipoRespuesta] = useState(tiposRespuestaDisponibles.BINARIA);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [editText, setEditText] = useState('');
  const [editFactor, setEditFactor] = useState(1);
  const [editTipoRespuesta, setEditTipoRespuesta] = useState(tiposRespuestaDisponibles.BINARIA);

  const handleAddQuestion = () => {
    if (newQuestion.trim() === '') return;

    const newQuestionObj = {
      id: questions.length > 0 ? Math.max(...questions.map(q => q.id || 0)) + 1 : 1,
      texto: newQuestion,
      factor: newFactor,
      tipoRespuesta: newTipoRespuesta
    };

    setQuestions([...questions, newQuestionObj]);
    setQuestionWeights([...questionWeights, newWeight]);

    setNewQuestion('');
    setNewWeight(10);
    setNewFactor(1);
    setNewTipoRespuesta(tiposRespuestaDisponibles.BINARIA);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setQuestionWeights(questionWeights.filter((_, i) => i !== index));
  };

  const handleWeightChange = (index, value) => {
    const updated = [...questionWeights];
    updated[index] = parseInt(value);
    setQuestionWeights(updated);
  };

  const startEditing = (index) => {
    const question = questions[index];
    setEditingIndex(index);
    setEditText(question.texto);
    setEditFactor(question.factor);
    setEditTipoRespuesta(question.tipoRespuesta);
  };

  const cancelEditing = () => {
    setEditingIndex(-1);
    setEditText('');
    setEditFactor(1);
    setEditTipoRespuesta(tiposRespuestaDisponibles.BINARIA);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;

    const updatedQuestions = [...questions];
    updatedQuestions[editingIndex] = {
      ...updatedQuestions[editingIndex],
      texto: editText,
      factor: editFactor,
      tipoRespuesta: editTipoRespuesta
    };

    setQuestions(updatedQuestions);
    cancelEditing();
  };

  return (
    <div className="preguntas-tab">
      <h2>Preguntas de la Encuesta</h2>
      <div className="questions-list">
        {questions.map((question, index) => (
          <div key={index} className="question-item">
            {editingIndex === index ? (
              <div className="question-edit">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <select value={editFactor} onChange={(e) => setEditFactor(parseInt(e.target.value))}>
                  {factoresDisponibles.map(f => (
                    <option key={f.id} value={f.id}>{f.nombre}</option>
                  ))}
                </select>
                <select value={editTipoRespuesta} onChange={(e) => setEditTipoRespuesta(e.target.value)}>
                  <option value={tiposRespuestaDisponibles.BINARIA}>Sí/No</option>
                  <option value={tiposRespuestaDisponibles.FRECUENCIA}>Frecuencia</option>
                  <option value={tiposRespuestaDisponibles.FRECUENCIA_NA}>Frecuencia con N/A</option>
                  <option value={tiposRespuestaDisponibles.VALORACION}>Valoración</option>
                </select>
                <button onClick={saveEdit} className="btn-success">Guardar</button>
                <button onClick={cancelEditing} className="btn-secondary">Cancelar</button>
              </div>
            ) : (
              <>
                <span>{index + 1}. {question.texto}</span>
                <div className="question-metadata">
                  <span>Factor: {factoresDisponibles.find(f => f.id === question.factor)?.nombre || 'N/A'}</span>
                  <span>Tipo: {question.tipoRespuesta}</span>
                </div>
                <div className="question-actions">
                  <label>Peso:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={questionWeights[index]}
                    onChange={(e) => handleWeightChange(index, e.target.value)}
                  />
                  <button onClick={() => startEditing(index)} className="btn-primary">Editar</button>
                  <button onClick={() => handleRemoveQuestion(index)} className="btn-danger">Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="add-question">
        <h3>Agregar Nueva Pregunta</h3>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Escriba la pregunta"
        />
        <input
          type="number"
          min="1"
          max="10"
          value={newWeight}
          onChange={(e) => setNewWeight(parseInt(e.target.value))}
        />
        <select value={newFactor} onChange={(e) => setNewFactor(parseInt(e.target.value))}>
          {factoresDisponibles.map(f => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>
        <select value={newTipoRespuesta} onChange={(e) => setNewTipoRespuesta(e.target.value)}>
          <option value={tiposRespuestaDisponibles.BINARIA}>Sí/No</option>
          <option value={tiposRespuestaDisponibles.FRECUENCIA}>Frecuencia</option>
          <option value={tiposRespuestaDisponibles.FRECUENCIA_NA}>Frecuencia con N/A</option>
          <option value={tiposRespuestaDisponibles.VALORACION}>Valoración</option>
        </select>
        <button onClick={handleAddQuestion} className="btn-success">Agregar</button>
      </div>
    </div>
  );
}

export default PreguntasTab;
