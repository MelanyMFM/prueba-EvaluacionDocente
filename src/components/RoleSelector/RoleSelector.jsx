import { useNavigate } from 'react-router-dom';
import estudiante from "../../assets/estudiante.png";
import docente from "../../assets/docente.png";
import directiva from "../../assets/directiva.png";
import "./roleSelector.css";

/**
 * Componente RoleSelector - Selector de Roles
 * 
 * Este componente muestra la interfaz de selección de roles para el sistema EDIFICANDO.
 * Permite a los usuarios seleccionar su rol (estudiante, docente o directivo) y
 * proporciona información sobre el sistema de evaluación docente.
 * 
 * Funciones principales:
 * - Muestra información del sistema EDIFICANDO
 * - Proporciona tres opciones de rol con navegación respectiva
 * - Interfaz responsiva adaptable a diferentes dispositivos
 * 
 * @returns {JSX.Element} Interfaz de selección de roles
 */
function RoleSelector() {
  // Hook para navegación programática entre rutas
  const navigate = useNavigate();

  return (
    <div className="role-selector">
      {/* Título principal del sistema */}
      <h1 className="role-title">
        Evaluación Docente Integral con Fines de Mejoramiento
      </h1>
      
      {/* Contenedor principal con layout en grid */}
      <div className="role-container">
        {/* Panel informativo del sistema EDIFICANDO */}
        <div className="role-info">
          <div className="info-card">
            <h2>Bienvenido(a) a EDIFICANDO</h2>
            {/* Descripción del sistema y sus objetivos */}
            <p>
              EDIFICANDO es el conjunto de instrumentos, aplicaciones y procesos
              de la Universidad Nacional de Colombia que permite entregarle
              a los docentes y a las diferentes instancias institucionales
              información oportuna sobre su desempeño, obtenida
              mediante la valiosa participación de diferentes
              perspectivas de la comunidad académica.
            </p>
            {/* Explicación del uso de la información recolectada */}
            <p>
              Esta información deberá analizarse y valorarse en
              conjunto y de manera integral e integrada, con el objeto
              de descubrir fortalezas y debilidades, y así
              emprender acciones individuales, colectivas e
              institucionales de mejoramiento continuo de la calidad docente.
            </p>
          </div>
        </div>

        {/* Panel de selección de roles */}
        <div className="role-selection">
          {/* Mensaje instructivo para el usuario */}
          <div className="role-alert">
            Para continuar, haga clic en su rol dentro de la comunidad académica.
          </div>

          {/* Contenedor de botones de roles */}
          <div className="role-buttons">
            {/* Botón para estudiantes - navega a /estudiante */}
            <button 
              onClick={() => navigate('/estudiante')} 
              className="role-button"
              aria-label="Acceder como estudiante"
            >
              <h3>Estudiantes</h3>
              <img src={estudiante} alt="Icono de estudiante" />
            </button>
            
            {/* Botón para docentes - navega a /docente */}
            <button 
              onClick={() => navigate('/docente')} 
              className="role-button"
              aria-label="Acceder como docente"
            >
              <h3>Docentes</h3>
              <img src={docente} alt="Icono de docente" />
            </button>
            
            {/* Botón para directivos - navega a /admin */}
            <button 
              onClick={() => navigate('/admin')} 
              className="role-button"
              aria-label="Acceder como directivo"
            >
              <h3>Directivas</h3>
              <img src={directiva} alt="Icono de directivo" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelector;
