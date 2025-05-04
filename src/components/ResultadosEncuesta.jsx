function ResultadosEncuesta({ teacherName, courseResults, showTeacherName = true }) {
  // Agrupar resultados por asignatura (ignorando mayúsculas/minúsculas)
  const agrupados = {};
  
  courseResults.forEach(course => {
    // Normalizar el nombre de la asignatura (convertir a minúsculas)
    const nombreNormalizado = course.nombreAsignatura.toLowerCase();
    
    if (!agrupados[nombreNormalizado]) {
      agrupados[nombreNormalizado] = {
        nombreAsignatura: course.nombreAsignatura, // Mantener el primer nombre que encontremos
        participaciones: 0,
        totalPuntos: 0
      };
    }
    
    // Sumar participaciones y puntos
    agrupados[nombreNormalizado].participaciones += course.participaciones;
    agrupados[nombreNormalizado].totalPuntos += parseFloat(course.nota) * course.participaciones;
  });
  
  // Convertir el objeto agrupado a un array y calcular las notas finales
  const resultadosAgrupados = Object.values(agrupados).map(grupo => ({
    nombreAsignatura: grupo.nombreAsignatura,
    participaciones: grupo.participaciones,
    nota: (grupo.totalPuntos / grupo.participaciones).toFixed(2)
  }));
  
  // Calcular el total de participaciones y el promedio general
  const totalParticipaciones = resultadosAgrupados.reduce((sum, course) => sum + course.participaciones, 0);
  const promedioGeneral = resultadosAgrupados.reduce((sum, course) => sum + (parseFloat(course.nota) * course.participaciones), 0) / totalParticipaciones;
  
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
            {resultadosAgrupados.map((course, index) => (
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