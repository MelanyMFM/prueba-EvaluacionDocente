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
    
    // Crear nueva pregunta con formato actualizado
    const newQuestionObj = {
      id: questions.length > 0 ? Math.max(...questions.map(q => q.id || 0)) + 1 : 1,
      texto: newQuestion,
      factor: newFactor,
      tipoRespuesta: newTipoRespuesta
    };
    
    // Verificar si estamos trabajando con el formato antiguo o nuevo
    const isOldFormat = typeof questions[0] === 'string';
    
    if (isOldFormat) {
      // Convertir todas las preguntas antiguas al nuevo formato
      const updatedQuestions = questions.map((q, index) => ({
        id: index + 1,
        texto: q,
        factor: 1,
        tipoRespuesta: tiposRespuestaDisponibles.BINARIA
      }));
      
      setQuestions([...updatedQuestions, newQuestionObj]);
    } else {
      setQuestions([...questions, newQuestionObj]);
    }
    
    setQuestionWeights([...questionWeights, newWeight]);
    setNewQuestion('');
    setNewWeight(10);
    setNewFactor(1);
    setNewTipoRespuesta(tiposRespuestaDisponibles.BINARIA);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const updatedWeights = questionWeights.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setQuestionWeights(updatedWeights);
  };

  const handleWeightChange = (index, value) => {
    const updatedWeights = [...questionWeights];
    updatedWeights[index] = parseInt(value);
    setQuestionWeights(updatedWeights);
  };

  const startEditing = (index) => {
    const question = questions[index];
    setEditingIndex(index);
    
    // Verificar si estamos trabajando con el formato antiguo o nuevo
    if (typeof question === 'string') {
      setEditText(question);
      setEditFactor(1);
      setEditTipoRespuesta(tiposRespuestaDisponibles.BINARIA);
    } else {
      setEditText(question.texto);
      setEditFactor(question.factor || 1);
      setEditTipoRespuesta(question.tipoRespuesta || tiposRespuestaDisponibles.BINARIA);
    }
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
    
    // Verificar si estamos trabajando con el formato antiguo o nuevo
    const isOldFormat = typeof questions[0] === 'string';
    
    if (isOldFormat) {
      // Convertir todas las preguntas antiguas al nuevo formato
      const convertedQuestions = questions.map((q, idx) => ({
        id: idx + 1,
        texto: idx === editingIndex ? editText : q,
        factor: idx === editingIndex ? editFactor : 1,
        tipoRespuesta: idx === editingIndex ? editTipoRespuesta : tiposRespuestaDisponibles.BINARIA
      }));
      
      setQuestions(convertedQuestions);
    } else {
      updatedQuestions[editingIndex] = {
        ...updatedQuestions[editingIndex],
        texto: editText,
        factor: editFactor,
        tipoRespuesta: editTipoRespuesta
      };
      setQuestions(updatedQuestions);
    }
    
    setEditingIndex(-1);
    setEditText('');
    setEditFactor(1);
    setEditTipoRespuesta(tiposRespuestaDisponibles.BINARIA);
  };

  return (
    <div className="preguntas-tab">
      <h2>Preguntas de la Encuesta</h2>
      <div className="questions-list">
        {questions
          .sort((a, b) => {
            // Ordenar por factor (primero factor 1, luego 2, etc.)
            const factorA = typeof a === 'string' ? 1 : a.factor;
            const factorB = typeof b === 'string' ? 1 : b.factor;
            return factorA - factorB;
          })
          .map((question, index) => (
          <div key={index} className="question-item">
            {editingIndex === index ? (
              <div className="question-edit">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-question-input"
                />
                <div className="edit-options">
                  <div className="edit-option">
                    <label>Factor:</label>
                    <select 
                      value={editFactor} 
                      onChange={(e) => setEditFactor(parseInt(e.target.value))}
                    >
                      {factoresDisponibles.map(factor => (
                        <option key={factor.id} value={factor.id}>
                          {factor.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="edit-option">
                    <label>Tipo de respuesta:</label>
                    <select 
                      value={editTipoRespuesta} 
                      onChange={(e) => setEditTipoRespuesta(e.target.value)}
                    >
                      <option value={tiposRespuestaDisponibles.BINARIA}>Sí/No</option>
                      <option value={tiposRespuestaDisponibles.FRECUENCIA}>Frecuencia</option>
                      <option value={tiposRespuestaDisponibles.FRECUENCIA_NA}>Frecuencia con N/A</option>
                      <option value={tiposRespuestaDisponibles.VALORACION}>Valoración</option>
                    </select>
                  </div>
                </div>
                <div className="edit-actions">
                  <button onClick={saveEdit} className="btn-success">
                    Guardar
                  </button>
                  <button onClick={cancelEditing} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="question-text">
                  <span>{index + 1}. {typeof question === 'string' ? question : question.texto}</span>
                  {typeof question !== 'string' && (
                    <div className="question-metadata">
                      <span className="question-factor">
                        Factor: {factoresDisponibles.find(f => f.id === question.factor)?.nombre || 'No definido'}
                      </span>
                      <span className="question-type">
                        Tipo: {
                          question.tipoRespuesta === tiposRespuestaDisponibles.BINARIA ? 'Sí/No' :
                          question.tipoRespuesta === tiposRespuestaDisponibles.FRECUENCIA ? 'Frecuencia' :
                          question.tipoRespuesta === tiposRespuestaDisponibles.FRECUENCIA_NA ? 'Frecuencia con N/A' :
                          question.tipoRespuesta === tiposRespuestaDisponibles.VALORACION ? 'Valoración' : 'Desconocido'
                        }
                      </span>
                    </div>
                  )}
                </div>
                <div className="question-actions">
                  <div className="question-weight">
                    <label>Peso:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={questionWeights[index]}
                      onChange={(e) => handleWeightChange(index, e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => startEditing(index)}
                    className="btn-primary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="add-question">
        <h3>Agregar Nueva Pregunta</h3>
        <div className="new-question-form">
          <div className="form-group">
            <label>Pregunta:</label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Escriba la nueva pregunta"
            />
          </div>
          <div className="form-group">
            <label>Peso (1-10):</label>
            <input
              type="number"
              min="1"
              max="10"
              value={newWeight}
              onChange={(e) => setNewWeight(parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Factor:</label>
            <select 
              value={newFactor} 
              onChange={(e) => setNewFactor(parseInt(e.target.value))}
            >
              {factoresDisponibles.map(factor => (
                <option key={factor.id} value={factor.id}>
                  {factor.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tipo de respuesta:</label>
            <select 
              value={newTipoRespuesta} 
              onChange={(e) => setNewTipoRespuesta(e.target.value)}
            >
              <option value={tiposRespuestaDisponibles.BINARIA}>Sí/No</option>
              <option value={tiposRespuestaDisponibles.FRECUENCIA}>Frecuencia</option>
              <option value={tiposRespuestaDisponibles.FRECUENCIA_NA}>Frecuencia con N/A</option>
              <option value={tiposRespuestaDisponibles.VALORACION}>Valoración</option>
            </select>
          </div>
          <button onClick={handleAddQuestion} className="btn-success">
            Agregar Pregunta
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreguntasTab;