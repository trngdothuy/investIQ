import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'

export const Route = createFileRoute('/questionnaireBatches/batch2')({
  component: Batch2,
})

const reasonOptions = [
  'Grow my wealth over time',
  'Save for retirement',
  'Generate a regular income from my investments',
  'Reach financial independence/freedom',
  'Preserve what I already have',
]

const horizonOptions = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  'More than 10 years',
]

const contributionOptions = [
  'Weekly',
  'Bi-weekly (Every 2 weeks)',
  'Monthly',
  'Quarterly (Every 3 months)',
  'Annually (Once a year)',
  "I don't contribute regularly yet",
]

function ChipGroup({
  options,
  selected,
  onSelect,
}){
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`px-4 py-2 rounded border-2 text-sm cursor-pointer transition-all
            ${
              selected === option
                ? 'border-primary bg-primary text-primary-content font-semibold'
                : 'border-base-300 hover:border-primary/50'
            }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function Batch2() {
  const navigate = useNavigate()
  const { answers, updateAnswers } = useQuestionnaire()

  const [reason, setReason] = useState(answers.reason ?? '')
  const [horizon, setHorizon] = useState(answers.horizon ?? '')
  const [contributionFrequency, setContributionFrequency] = useState(
    answers.contributionFrequency ?? '',
  )

  const canProceed = reason !== '' && horizon !== '' && contributionFrequency !== ''

  function handleNext() {
    updateAnswers({ reason, horizon, contributionFrequency })
    navigate({ to: '/questionnaireBatches/batch3' })
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-6">
      <p className="text-sm text-base-content/50 mb-1">Investment Goals</p>
      <p className="text-sm text-base-content/50 mb-4 italic">Step 2 of 5</p>
      <progress className="progress progress-primary w-full mb-8" value={50} max={100} />

      {/* Q4 */}
      <div className="mb-6">
        <p className="block font-medium mb-3">4. What is your main reason for investing?</p>
        <ChipGroup options={reasonOptions} selected={reason} onSelect={setReason} />
      </div>

      {/* Q5 */}
      <div className="mb-6">
        <p className="block font-medium mb-3">
          5. How long are you planning to keep your money invested?
        </p>
        <ChipGroup options={horizonOptions} selected={horizon} onSelect={setHorizon} />
      </div>

      {/* Q6 */}
      <div className="mb-8">
        <p className="block font-medium mb-3">
          6. How often do you currently add money to your investments?
        </p>
        <ChipGroup
          options={contributionOptions}
          selected={contributionFrequency}
          onSelect={setContributionFrequency}
        />
      </div>

      <button className="btn btn-primary w-full" disabled={!canProceed} onClick={handleNext}>
        Next
      </button>
    </div>
  )
}
