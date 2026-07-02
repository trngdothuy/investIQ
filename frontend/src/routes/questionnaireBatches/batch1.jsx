import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'
import QuestionnaireLayout from '../../components/questionnaireLayout'
import ProgressHeader from '../../components/progressHeader'
import QuestionBlock from '../../components/questionBlock'

export const Route = createFileRoute('/questionnaireBatches/batch1')({
  component: Batch1,
})

const situationOptions = [
  'Student',
  'Working full-time',
  'Working part-time',
  'Self-employed / freelancer',
  'Retired',
  'Between jobs / career change',
]

function Batch1() {
  const navigate = useNavigate()
  const { answers, updateAnswers } = useQuestionnaire()

  const [name, setName] = useState(answers.name ?? '')
  const [age, setAge] = useState(answers.age ?? '')
  const [ageError, setAgeError] = useState('')
  const [situation, setSituation] = useState(answers.situation ?? '')

  function handleAgeChange(e) {
    const val = e.target.value
    setAge(val)

    const num = Number(val)

    if (val === '') setAgeError('')
    else if (!Number.isInteger(num) || num < 18 || num > 99) {
      setAgeError('Please enter a valid age between 18 and 99.')
    } else {
      setAgeError('')
    }
  }

  const ageValid = age !== '' && ageError === ''
  const canProceed = name.trim() && ageValid && situation

  function handleNext() {
    updateAnswers({ name, age: Number(age), situation })
    navigate({ to: '/questionnaireBatches/batch2' })
  }

  const isComplete = canProceed

  return (
    <QuestionnaireLayout>
      <ProgressHeader title="Basic Information" step={1} totalSteps={5} />

      {/* Q1 */}
      <QuestionBlock
        title="What should we call you?"
        helper="This helps us personalize your InvestIQ experience."
        completed={!!name}
      >
        <input
          type="text"
          className="input w-full"
          placeholder="e.g. Alex"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </QuestionBlock>

      {/* Q2 */}
      <QuestionBlock
        title="How old are you?"
        helper="We use this to personalize risk guidance and investment insights."
        completed={ageValid}
      >
        <input
          type="number"
          className={`input w-full ${ageError ? 'input-error' : ''}`}
          placeholder="18-99"
          value={age}
          onChange={handleAgeChange}
        />
        {ageError && <p className="q-helperError text-red-500">{ageError}</p>}
      </QuestionBlock>

      {/* Q3 */}
      <QuestionBlock
        title="What best describes your current situation?"
        helper="Helps us understand your financial stability."
        completed={!!situation}
      >
        <div className="q-options">
          {situationOptions.map((option) => {
            const isLong = option.length > 28

            return (
              <button
                key={option}
                type="button"
                onClick={() => setSituation(option)}
                className={`q-option-btn ${situation === option ? 'active' : ''}`}
                style={{
                  gridColumn: isLong ? 'span 2' : 'span 1',
                }}
              >
                {option}
              </button>
            )
          })}
        </div>
      </QuestionBlock>

      {/* NAVIGATION */}
      <div className="q-nav-actions mt-12 flex justify-between gap-4">
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => navigate({ to: '/questionnaire' })}
        >
          ← Back
        </button>

        <button className="btn btn-primary w-full" disabled={!canProceed} onClick={handleNext}>
          {isComplete ? 'Continue →' : 'Next →'}
        </button>
      </div>
    </QuestionnaireLayout>
  )
}
