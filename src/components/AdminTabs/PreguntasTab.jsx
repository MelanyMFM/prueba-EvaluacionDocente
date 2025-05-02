import React, { useState } from 'react';

function PreguntasTab({ questions, setQuestions, questionWeights, setQuestionWeights }) {
  const [newQuestion, setNewQuestion] = useState('');
  const [newWeight, setNewWeight] = useState(10);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editText, setEditText] = useState('');

  const handleAddQuestion = () => {
    if (newQuestion.trim() === '') return;
    setQuestions([...questions, newQuestion]);
    setQuestionWeights([...questionWeights, newWeight]);
    setNewQuestion('');
    setNewWeight(10);
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
    setEditingIndex(index);
    setEditText(questions[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(-1);
    setEditText('');
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    
    const updatedQuestions = [...questions];
    updatedQuestions[editingIndex] = editText;
    setQuestions(updatedQuestions);
    
    setEditingIndex(-1);
    setEditText('');
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
                  className="edit-question-input"
                />
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
                  <span>{index + 1}. {question}</span>
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
          <button onClick={handleAddQuestion} className="btn-success">
            Agregar Pregunta
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreguntasTab;