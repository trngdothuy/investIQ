import { createContext, useContext, useState } from 'react'

const QuestionnaireContext = createContext(null)

export function QuestionnaireProvider({ children }) {
  const [answers, setAnswers] = useState({})

  function updateAnswers(newAnswers) {
    setAnswers((prev) => ({ ...prev, ...newAnswers }))
  }

  return (
    <QuestionnaireContext.Provider value={{ answers, updateAnswers }}>
      {children}
    </QuestionnaireContext.Provider>
  )
}

export function useQuestionnaire() {
  return useContext(QuestionnaireContext)
}
