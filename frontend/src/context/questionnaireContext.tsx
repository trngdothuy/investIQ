import { createContext, useContext, useEffect, useState } from 'react'

const QuestionnaireContext = createContext(null)

const STORAGE_KEY = 'investiq-questionnaire'
const STORAGE_VERSION = 1

export function QuestionnaireProvider({ children }) {
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return {}

    try {
      const parsed = JSON.parse(saved)

      if (parsed.version !== STORAGE_VERSION) {
        localStorage.removeItem(STORAGE_KEY)
        return {}
      }

      return parsed
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return {}
    }
  })

  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  }, [answers])

  function updateAnswers(newAnswers) {
    setAnswers((prev) => {
      const createdAt = prev.createdAt ?? new Date().toISOString()

      return {
        ...prev,
        ...newAnswers,

        version: STORAGE_VERSION,
        createdAt,
        updatedAt: new Date().toISOString(),
        lastVisitedBatch:
          newAnswers.lastCompletedBatch ??
          newAnswers.lastVisitedBatch ??
          prev.lastVisitedBatch ??
          0,
      }
    })
  }

  function resetAnswers() {
    localStorage.removeItem(STORAGE_KEY)
    setAnswers({})
  }

  return (
    <QuestionnaireContext.Provider
      value={{
        answers,
        updateAnswers,
        resetAnswers,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  )
}

export function useQuestionnaire() {
  return useContext(QuestionnaireContext)
}
