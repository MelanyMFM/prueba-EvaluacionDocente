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
        factores: course.factores || {},
        promedioGeneral: 0,
        periodo: course.periodo
      };
    }
    
    // Sumar participaciones y actualizar factores
    agrupados[nombreNormalizado].participaciones += course.participaciones;
    
    // Actualizar factores
    Object.entries(course.factores || {}).forEach(([factorId, factor]) => {
      if (!agrupados[nombreNormalizado].factores[factorId]) {
        agrupados[nombreNormalizado].factores[factorId] = {
          nombre: factor.nombre,
          totalPuntos: 0,
          puntosMaximos: 0,
          promedio: 0
        };
      }
      
      agrupados[nombreNormalizado].factores[factorId].totalPuntos += factor.totalPuntos;
      agrupados[nombreNormalizado].factores[factorId].puntosMaximos += factor.puntosMaximos;
    });
    
    // Actualizar promedio general
    agrupados[nombreNormalizado].promedioGeneral += parseFloat(course.promedioGeneral) * course.participaciones;
  });
  
  // Convertir el objeto agrupado a un array y calcular los promedios finales
  const resultadosAgrupados = Object.values(agrupados).map(grupo => {
    // Calcular promedios por factor
    Object.values(grupo.factores).forEach(factor => {
      if (factor.puntosMaximos > 0) {
        factor.promedio = ((factor.totalPuntos / factor.puntosMaximos) * 5).toFixed(2);
      }
    });
    
    return {
      nombreAsignatura: grupo.nombreAsignatura,
      participaciones: grupo.participaciones,
      factores: grupo.factores,
      promedioGeneral: (grupo.promedioGeneral / grupo.participaciones).toFixed(2),
      periodo: grupo.periodo
    };
  });
  
  // Calcular el total de participaciones
  const totalParticipaciones = resultadosAgrupados.reduce((sum, course) => sum + course.participaciones, 0);
  
  return (
    <div className="resultados-container">
      {showTeacherName && <h2 className="nombre-docente">{teacherName}</h2>}
      
      <div className="tabla-resultados">
        {resultadosAgrupados.map((course, index) => (
          <div key={index} className="course-results">
            <div className="course-header">
              <h3>{course.nombreAsignatura}</h3>
              <span className="periodo">Periodo: {course.periodo}</span>
            </div>
            <p>Participaciones: {course.participaciones}</p>
            
            <table>
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Promedio</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(course.factores).map(([factorId, factor]) => (
                  <tr key={factorId}>
                    <td>{factor.nombre}</td>
                    <td>{factor.promedio}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td><strong>Promedio General</strong></td>
                  <td><strong>{course.promedioGeneral}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
        
        <div className="total-results">
          <h3>Total de Participaciones: {totalParticipaciones}</h3>
        </div>
      </div>
    </div>
  );
}

export default ResultadosEncuesta;