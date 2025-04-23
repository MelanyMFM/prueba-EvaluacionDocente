function EstadoEncuesta({ isSurveyActive, onToggle }){
  return (
    <div>
      <h3>Estado de la encuesta</h3>
      <p>Encuesta: <strong>{isSurveyActive ? 'Activa' : 'Inactiva'}</strong></p>
      <button onClick={onToggle}>
        {isSurveyActive ? 'Desactivar' : 'Activar'} Encuesta
      </button>
    </div>
  );
};

export default EstadoEncuesta; 