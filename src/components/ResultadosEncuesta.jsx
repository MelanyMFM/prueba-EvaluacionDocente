function ResultadosEncuesta({ teacherName, courseResults, showTeacherName = true }) {
  // Calcular el total de participaciones y el promedio general
  const totalParticipaciones = courseResults.reduce((sum, course) => sum + course.participaciones, 0);
  const promedioGeneral = courseResults.reduce((sum, course) => sum + (parseFloat(course.nota) * course.participaciones), 0) / totalParticipaciones;
  
  return (
    <div className="resultados-container">
      {showTeacherName && <h2 className="nombre-docente">{teacherName}</h2>}
      
      <div className="tabla-resultados">
        <table>
          <thead>
            <tr>
              <th>Asignatura</th>
              <th>Participaciones</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {courseResults.map((course, index) => (
              <tr key={index}>
                <td>{course.nombreAsignatura}</td>
                <td>{course.participaciones}</td>
                <td>{course.nota}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td><strong>Promedio General</strong></td>
              <td><strong>{totalParticipaciones}</strong></td>
              <td><strong>{promedioGeneral.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultadosEncuesta;