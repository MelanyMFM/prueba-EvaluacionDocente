function ResultadosEncuesta({ finalScores, totalResponses }){
  return (
    <div>
      <h3>Resultados publicados</h3>
      <p>Nota Docente: <strong>{finalScores.docente1}</strong></p>
      <p>Total de respuestas: {totalResponses}</p>
    </div>
  );
};

export default ResultadosEncuesta; 