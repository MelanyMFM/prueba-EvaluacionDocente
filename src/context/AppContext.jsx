import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSurveyActive, setIsSurveyActive] = useState(true);
  const [questions, setQuestions] = useState([
    "¿El docente explica claramente los temas?",
    "¿El docente responde las dudas?",
    "¿El docente utiliza ejemplos prácticos?"
  ]);
  const [surveyWeight, setSurveyWeight] = useState(20);
  const [responses, setResponses] = useState({}); // { estudianteId: [1, 2, 3] }
  const [resultsPublished, setResultsPublished] = useState(false);
  const [finalScores, setFinalScores] = useState({}); // { docenteId: nota }
  const [questionWeights, setQuestionWeights] = useState([1, 1, 1]); // pesos iniciales


  return (
    <AppContext.Provider value={{
      isSurveyActive,
      setIsSurveyActive,
      questions,
      setQuestions,
      surveyWeight,
      setSurveyWeight,
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
