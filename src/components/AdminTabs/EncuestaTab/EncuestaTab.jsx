import "./encuestaTab.css";

function EncuestaTab({ encuestaActiva, setEncuestaActiva }) {
  return (
    <div className="encuesta-tab">
      <h2>Estado de la Encuesta</h2>
      <div className="encuesta-status">
        <p>La encuesta está actualmente: <strong>{encuestaActiva ? 'Activa' : 'Inactiva'}</strong></p>
        <button
          onClick={() => setEncuestaActiva(!encuestaActiva)}
          className={encuestaActiva ? 'btn-danger' : 'btn-success'}
        >
          {encuestaActiva ? 'Desactivar Encuesta' : 'Activar Encuesta'}
        </button>
      </div>
    </div>
  );
}

export default EncuestaTab;