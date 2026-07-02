import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'

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
    if (val === '') {
      setAgeError('')
    } else if (!Number.isInteger(num) || num < 18 || num > 99) {
      setAgeError('Please enter a valid age between 18 and 99.')
    } else {
      setAgeError('')
    }
  }

  const ageValid = age !== '' && ageError === ''
  const canProceed = name.trim() !== '' && ageValid && situation !== ''

  function handleNext() {
    updateAnswers({ name, age: Number(age), situation })
    navigate({ to: '/questionnaireBatches/batch2' })
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-6">
      <p className="text-sm text-base-content/50 mb-1">Basic Information</p>
      <p className="text-sm text-base-content/50 mb-4 italic">Step 1 of 5</p>
      <progress className="progress progress-primary w-full mb-8" value={25} max={100} />

      {/* Q1 */}
      <div className="mb-6">
        <label htmlFor="display-name" className="block font-medium mb-2">1. What should we call you?</label>
        <input
          type="text"
          id="display-name"
          className="input input-bordered w-full"
          placeholder="e.g. Alex"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Q2 */}
      <div className="mb-6">
        <label htmlFor="age" className="block font-medium mb-2">2. How old are you?</label>
        <input
          type="number"
          className={`input input-bordered w-full ${ageError ? 'input-error' : ''}`}
          placeholder="Enter your age (18-99)"
          min={18}
          max={99}
          value={age}
          onChange={handleAgeChange}
        />
        {ageError && <p className="text-error text-sm mt-1">{ageError}</p>}
      </div>

      {/* Q3 */}
      <div className="mb-8">
        <p className="block font-medium mb-3">
          3. What best describes your current situation?
        </p>
        <div className="flex flex-wrap gap-2">
          {situationOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSituation(option)}
              className={`px-4 py-2 rounded border-2 text-sm cursor-pointer transition-all
                ${
                  situation === option
                    ? 'border-primary bg-primary text-primary-content font-semibold'
                    : 'border-base-300 hover:border-primary/50'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn-primary w-full" disabled={!canProceed} onClick={handleNext}>
        Next
      </button>
    </div>
  )
}
