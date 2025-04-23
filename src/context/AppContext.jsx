import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSurveyActive, setIsSurveyActive] = useState(true);
  const [questions, setQuestions] = useState([
    "¿El docente explica bien?",
    "¿El docente responde dudas?",
    "¿El docente es bueno?"
  ]);
  const [responses, setResponses] = useState({}); // { estudianteId: [1, 2, 3] }
  const [resultsPublished, setResultsPublished] = useState(false);
  const [finalScores, setFinalScores] = useState({}); // { docenteId: nota }
  const [questionWeights, setQuestionWeights] = useState([1.6666, 1.6666, 1.6666]); // pesos iniciales


  return (
    <AppContext.Provider value={{
      isSurveyActive,
      setIsSurveyActive,
      questions,
      setQuestions,
      responses,
      setResponses,
      resultsPublished,
      setResultsPublished,
      finalScores,
      setFinalScores,
      questionWeights
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
