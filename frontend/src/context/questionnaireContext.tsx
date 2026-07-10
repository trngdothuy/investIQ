import { createContext, useContext, useEffect, useState } from 'react'

const QuestionnaireContext = createContext(null)

const STORAGE_KEY = 'investIQ-questionnaire'

export function QuestionnaireProvider({ children }) {
  const [answers, setAnswers] = useState(() => {
  try {
    const savedAnswers = localStorage.getItem(STORAGE_KEY)
    return savedAnswers ? JSON.parse(savedAnswers) : {}
  } catch {
    return {}
  }
})

  function updateAnswers(newAnswers) {
    setAnswers((prev) => ({
      ...prev,
      ...newAnswers,
    }))
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  }, [answers])

  function clearAnswers() {
    localStorage.removeItem(STORAGE_KEY)
    setAnswers({})
  }

  return (
    <QuestionnaireContext.Provider
      value={{
        answers,
        updateAnswers,
        clearAnswers,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  )
}

export function useQuestionnaire() {
  return useContext(QuestionnaireContext)
}