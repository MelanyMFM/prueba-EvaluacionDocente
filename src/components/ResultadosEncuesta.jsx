function ResultadosEncuesta({ totalResponses, finalScores}){
  return (
    <div className="resultados-container">
      <h2 className="nombre-docente">Nombre docente</h2>
      
      <div className="tabla-resultados">
        <table>
          <thead>
            <tr>
              <th>Participaciones</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
              <tr >
                <td>{totalResponses}</td>
                <td>{finalScores.docente1}</td>
              </tr>
       
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultadosEncuesta;