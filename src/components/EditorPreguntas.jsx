function EditorPreguntas({ questions, weights, onQuestionChange, onWeightChange }){
  return (
    <div className="editor-preguntas-container">
      <h3>Editar preguntas y pesos</h3>
      {questions.map((q, idx) => (
        <div key={idx} className="pregunta-item">
          <div className="input-group">
            <label>Pregunta {idx + 1}: </label>
            <input
              type="text"
              value={q}
              onChange={(e) => onQuestionChange(idx, e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Peso de la pregunta: </label>
            <input
              type="number"
              min="0"
              value={weights[idx]}
              onChange={(e) => onWeightChange(idx, parseFloat(e.target.value))}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditorPreguntas; 