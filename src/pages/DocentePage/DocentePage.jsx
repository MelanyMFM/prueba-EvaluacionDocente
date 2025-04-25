import { useAppContext } from '../../context/AppContext';
import ResultadosEncuesta from '../../components/ResultadosEncuesta';
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
          <ResultadosEncuesta
            totalResponses={Object.keys(responses).length}
            finalScores={finalScores}/>
        </>
      )}
    </div>
  );
};

export default DocentePage;
  