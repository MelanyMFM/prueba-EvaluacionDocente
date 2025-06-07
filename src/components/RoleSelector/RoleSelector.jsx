import { useNavigate } from 'react-router-dom';
import estudiante from "../../assets/estudiante.png";
import docente from "../../assets/docente.png";
import directiva from "../../assets/directiva.png";
import "./roleSelector.css";

/**
 * RoleSelector Component
 * 
 * This component displays the role selection interface for the EDIFICANDO system.
 * It allows users to select their role (student, teacher, or administrator) and
 * provides information about the system.
 */
function RoleSelector() {
  const navigate = useNavigate();

  return (
    <div className="role-selector">
      <h1 className="role-title">
        Evaluación Docente Integral con Fines de Mejoramiento
      </h1>
      
      <div className="role-container">
        <div className="role-info">
          <div className="info-card">
            <h2>Bienvenido(a) a EDIFICANDO</h2>
            <p>
              EDIFICANDO es el conjunto de instrumentos, aplicaciones y procesos
              de la Universidad Nacional de Colombia que permite entregarle
              a los docentes y a las diferentes instancias institucionales
              información oportuna sobre su desempeño, obtenida
              mediante la valiosa participación de diferentes
              perspectivas de la comunidad académica.
            </p>
            <p>
              Esta información deberá analizarse y valorarse en
              conjunto y de manera integral e integrada, con el objeto
              de descubrir fortalezas y debilidades, y así
              emprender acciones individuales, colectivas e
              institucionales de mejoramiento continuo de la calidad docente.
            </p>
          </div>
        </div>

        <div className="role-selection">
          <div className="role-alert">
            Para continuar, haga clic en su rol dentro de la comunidad académica.
          </div>

          <div className="role-buttons">
            <button 
              onClick={() => navigate('/estudiante')} 
              className="role-button"
            >
              <h3>Estudiantes</h3>
              <img src={estudiante} alt="Estudiante" />
            </button>
            
            <button 
              onClick={() => navigate('/docente')} 
              className="role-button"
            >
              <h3>Docentes</h3>
              <img src={docente} alt="Docente" />
            </button>
            
            <button 
              onClick={() => navigate('/admin')} 
              className="role-button"
            >
              <h3>Directivas</h3>
              <img src={directiva} alt="Directiva" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelector;
