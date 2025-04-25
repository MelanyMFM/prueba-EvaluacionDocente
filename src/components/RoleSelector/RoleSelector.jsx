import { useNavigate } from 'react-router-dom';
import estudiante from "../../assets/estudiante.png";
import docente from "../../assets/docente.png";
import directiva from "../../assets/directiva.png";
import "./roleSelector.css";

function RoleSelector(){
  const navigate = useNavigate();

  return (
    <div className="role-selector">
      <h1 className='titulo-rolselector'>Evaluación Docente Integral con Fines de Mejoramiento</h1>
      <div className='panelRol'>

      <div className="col-lg-3">
      <ul className="list-group">
        <li className="list-group-item text-center">
          <h2>Bienvenido(a) a EDIFICANDO</h2>
        </li>
        <li className="list-group-item text-justify">
          <p>
            EDIFICANDO es el conjunto de instrumentos, aplicaciones y procesos
            de la Universidad Nacional de Colombia que permite entregarle
            a los docentes y a las diferentes instancias institucionales
            información oportuna sobre su desempeno, obtenida
            mediante la valiosa participación de diferentes
            perspectivas de la comunidad académica.</p>
        </li>
        <li className="list-group-item text-justify">
          <p>
            Esta información deberá analizarse y valorarse en
            conjunto y de manera integral e integrada, con el objeto
            de descubrir fortalezas y debilidades, y así
            emprender acciones individuales, colectivas e
            institucionales de mejoramiento continuo de la calidad docente.
          </p>
        </li>
      </ul>
    </div>
    <div className="roles-alerta">
    
    <div className="alert alert-success text-center">
            Para continuar, haga clic en su rol dentro de la comunidad académica.
      </div>

      <div className='roles-lista'>
          <button onClick={() => navigate('/estudiante')} className='rol-button'>
            <h3 className="text-center">Estudiantes</h3>
            <img src={estudiante} alt="estudiante" className="estudiante-image" />
          </button>
          <button onClick={() => navigate('/docente')} className='rol-button'>
            <h3 className="text-center">Docentes</h3>
            <img src={docente} alt="docente" className="docente-image" />
            </button>
          <button onClick={() => navigate('/admin')} className='rol-button'>
            <h3 className="text-center">Directivas</h3>
            <img src={directiva} alt="directiva" className="directiva-image" />
            </button>

      </div>
        
      
      </div>
    </div>
    </div>
  );
};

export default RoleSelector;
