import React, { useState } from 'react';
import "./resultadosTab.css";

function ResultadosTab({ resultsPublished, publishResults, responses, results }) {
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  return (
    <div className="resultados-tab">
      <h2>Resultados de la Evaluación</h2>
      <div className="results-actions">
        <p>
          Estado de los resultados: <strong>{resultsPublished ? 'Publicados' : 'No publicados'}</strong>
        </p>
        <p>
          Respuestas recibidas hasta el momento: <strong>{responses.length}</strong>
        </p>
        {!resultsPublished ? (
          <button onClick={publishResults} className="btn-success">
            Publicar Resultados
          </button>
        ) : (
          <div className="results-display">
            <h3>Lista de Docentes Evaluados</h3>
            <div className="teachers-list">
              {Object.keys(results).map(teacherId => (
                <div 
                  key={teacherId} 
                  className={`teacher-item ${selectedTeacher === teacherId ? 'selected' : ''}`}
                  onClick={() => setSelectedTeacher(selectedTeacher === teacherId ? null : teacherId)}
                >
                  <span className="teacher-name">{results[teacherId].nombre}</span>
                  <span className="teacher-score">Nota: {results[teacherId].puntaje}</span>
                </div>
              ))}
            </div>
            
            {selectedTeacher && (
              <div className="teacher-results-detail">
                <h4>Resultados de {results[selectedTeacher].nombre}</h4>
                <div className="tabla-resultados">
                  <table>
                    <thead>
                      <tr>
                        <th>Participaciones</th>
                        <th>Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{results[selectedTeacher].totalRespuestas}</td>
                        <td>{results[selectedTeacher].puntaje}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultadosTab;