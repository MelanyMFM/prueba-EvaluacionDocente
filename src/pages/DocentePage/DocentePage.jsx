import { useAppContext } from '../../context/AppContext';
import "./docentePage.css";

function DocentePage(){
  const { resultsPublished, finalScores, responses } = useAppContext();
  
  return (
    <div className='docente-container'>
      <h2>Resultados de la Evaluación</h2>
      
      {!resultsPublished ? (
        <p className='waiting-message'>Los resultados aún no son publicados</p>
      ) : (   
        <>
          <h3>La calificacion final es: {finalScores.docente1}</h3>
          <p>Total de respuestas: {Object.keys(responses).length}</p>
        </>
      )}
    </div>
  );
};

export default DocentePage;
  