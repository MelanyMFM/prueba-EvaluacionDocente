import "./evaluationForm.css";

function EvaluationForm({ questions, answers, onAnswerChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="evaluation-form">
      <h3>Evaluación Docente</h3>
      
      {questions.map((question, index) => (
        <div key={index} className="question-item">
          <p>{question}</p>
          <div className="rating">
            {[1, 2, 3, 4, 5].map(value => (
              <label key={value}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={value}
                  checked={answers[index] === value}
                  onChange={() => onAnswerChange(index, value)}
                />
                {value}
              </label>
            ))}
          </div>
        </div>
      ))}
      
      <button type="submit" className="submit-button">
        Enviar Evaluación
      </button>
    </form>
  );
}

export default EvaluationForm;