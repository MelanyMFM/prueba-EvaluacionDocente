import React from 'react';

function MessageDisplay({ type, onNavigateHome }) {
  if (type === 'inactive') {
    return (
      <div className="message-container">
        <h3>Encuesta no disponible</h3>
        <p>La encuesta de evaluación docente aún no ha sido habilitada por el administrador.</p>
        <button onClick={onNavigateHome}>Volver al inicio</button>
      </div>
    );
  }
  
  if (type === 'completed') {
    return (
      <div className="message-container">
        <h3>Has completado todas las evaluaciones</h3>
        <button onClick={onNavigateHome}>Volver al inicio</button>
      </div>
    );
  }
  
  return null;
}

export default MessageDisplay;