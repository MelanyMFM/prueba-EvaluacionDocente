import React, { useState, useEffect, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db2 } from '../firebaseApp2';
import { AppContext } from '../context/AppContext';

function ResultadosEncuesta({ teacherId, showTeacherName = true }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherData, setTeacherData] = useState(null);

  const { currentPeriod, currentSede, teachers } = useContext(AppContext);

  useEffect(() => {
    const fetchResults = async () => {
      if (!teacherId || !currentPeriod || !currentSede) {
        setError('Datos incompletos.');
        setLoading(false);
        return;
      }

      try {
        const docId = `${currentPeriod}_${currentSede}`;
        const docRef = doc(db2, 'resultsForm', docId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('No se encontraron resultados para este periodo y sede.');
          setLoading(false);
          return;
        }

        const resultsData = docSnap.data();
        const teacherResults = resultsData[String(teacherId)];

        if (!teacherResults) {
          setError('No se encontraron resultados para este docente.');
          setLoading(false);
          return;
        }

        setTeacherData(teacherResults);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar resultados:', err);
        setError('Error al cargar resultados.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [teacherId, currentPeriod, currentSede]);

  if (loading) return <p>Cargando resultados...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!teacherData) return null;

  const { nombre, promedioGeneral, factores } = teacherData;

  return (
    <div className="resultados-container">
      {showTeacherName && <h2 className="nombre-docente">{nombre}</h2>}

      <table className="tabla-resultados">
        <thead>
          <tr>
            <th>Factor</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(factores).map(([factorId, factor]) => (
            <tr key={factorId}>
              <td>{factor.nombre}</td>
              <td>{factor.promedio}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td><strong>Promedio General</strong></td>
            <td><strong>{promedioGeneral}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ResultadosEncuesta;
