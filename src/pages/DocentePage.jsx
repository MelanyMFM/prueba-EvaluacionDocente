import { useAppContext } from '../context/AppContext';

function DocentePage(){
  const { resultsPublished, finalScores } = useAppContext();
  
  return (
    <div>
      <h2>Resultados de la Evaluación</h2>
      
      {!resultsPublished ? (
        <p>Los resultados aún no son publicados</p>
      ) : (   
          <h3>La calificacion final es: {finalScores.docente1}</h3>
      )}
    </div>
  );
};

export default DocentePage;
  