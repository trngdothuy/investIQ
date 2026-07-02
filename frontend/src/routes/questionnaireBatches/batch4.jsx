import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'

export const Route = createFileRoute('/questionnaireBatches/batch4')({
  component: Batch4,
})

// const causeOptions = [
//   'Clean Energy & Sustainability',
//   'Technology & Innovation',
//   'Healthcare & Wellness',
//   'Education & Opportunity',
//   'Human Rights',
//   'Social Equality & Community',
//   'Renewable Energy',
//   'Ethical Business Practices',
//   'Local Economic Development',
//   'Financial Inclusion',
//   'Climate Action',
//   'Responsible Corporate Governance',
// ]

const exclusionOptions = [
  'Fast food and ultra-processed drinks',
  'Tobacco',
  'Fossil Fuels',
  'Weapons & Defense',
  'Gambling',
  'Fast Fashion',
  'None, I have no restrictions',
]

const highlightOptions = [
  'Human Rights', 
  'Tax Avoidance', 
  'Animal Rights', 
  'Habitats & Resources',
  'None of these',
]

function Batch4() {
  const navigate = useNavigate()
  const { answers, updateAnswers } = useQuestionnaire()

  // const [causes, setCauses] = useState<string[]>(answers.causes ?? [])
  const [exclusions, setExclusions] = useState(answers.exclusions ?? [])
  const [highlights, setHighlights] = useState(answers.highlights ?? [])

  // function toggleCause(option: string) {
  //   if (causes.includes(option)) {
  //     setCauses(causes.filter((c) => c !== option))
  //   } else if (causes.length < 5) {
  //     setCauses([...causes, option])
  //   }
  // }

  function toggleExclusion(option) {
    if (option === 'None, I have no restrictions') {
      setExclusions(['None, I have no restrictions'])
    } else {
      const withoutNone = exclusions.filter((e) => e !== 'None, I have no restrictions')
      if (withoutNone.includes(option)) {
        setExclusions(withoutNone.filter((e) => e !== option))
      } else {
        setExclusions([...withoutNone, option])
      }
    }
  }

  function toggleHighlight(option) {
    if (option === 'None of these') {
      setHighlights(['None of these'])
    } else {
      const withoutNone = highlights.filter((h) => h !== 'None of these')
      if (withoutNone.includes(option)) {
        setHighlights(withoutNone.filter((h) => h !== option))
      } else if (withoutNone.length < 3) {
        setHighlights([...withoutNone, option])
      }
    }
  }

  const canProceed = exclusions.length > 0 && highlights.length > 0

  function handleSubmit() {
    updateAnswers({ exclusions, highlights })
    navigate({ to: '/questionnaireBatches/batch5' })
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-6">
      <p className="text-sm text-base-content/50 mb-1">Portfolio Values & Alignment</p>
      <p className="text-sm text-base-content/50 mb-4 italic">Step 4 of 5</p>
      <progress className="progress progress-primary w-full mb-8" value={90} max={100} />

      {/* Q11 */}
      {/* <div className="mb-8">
        <label className="block font-medium mb-1">
          11. What causes would you like your investments to support?
        </label>
        <p className="text-sm text-base-content/50 mb-3 italic">Choose up to 5</p>
        <div className="flex flex-wrap gap-2">
          {causeOptions.map((option) => {
            const isSelected = causes.includes(option)
            const isDisabled = !isSelected && causes.length >= 5
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleCause(option)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded border-2 text-sm cursor-pointer transition-all
                  ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-content font-semibold'
                      : isDisabled
                        ? 'border-base-300 opacity-40 cursor-not-allowed'
                        : 'border-base-300 hover:border-primary/50'
                  }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div> */}

      {/* Q11 */}
      <div className="mb-8">
        <p className="block font-medium mb-1">
          11. Are there any industries you would prefer to avoid investing in?
        </p>
        <p className="text-sm text-base-content/50 mb-3 italic">Choose all that apply</p>
        <div className="flex flex-wrap gap-2">
          {exclusionOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleExclusion(option)}
              className={`px-4 py-2 rounded border-2 text-sm cursor-pointer transition-all
                ${
                  exclusions.includes(option)
                    ? 'border-primary bg-primary text-primary-content font-semibold'
                    : 'border-base-300 hover:border-primary/50'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Q12 */}
      <div className="mb-8">
        <p className="block font-medium mb-1">
          12. Are there any categories you would like your investments to avoid violating?
        </p>
        <p className="text-sm text-base-content/50 mb-3 italic">Choose up to 3</p>
        <div className="flex flex-wrap gap-2">
          {highlightOptions.map((option) => {
            const isSelected = highlights.includes(option)
            const isDisabled =
              option !== 'None of these' &&
              !isSelected &&
              !highlights.includes('None of these') &&
              highlights.length >= 3
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleHighlight(option)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded border-2 text-sm cursor-pointer transition-all
                  ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-content font-semibold'
                      : isDisabled
                        ? 'border-base-300 opacity-40 cursor-not-allowed'
                        : 'border-base-300 hover:border-primary/50'
                  }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      <button className="btn btn-primary w-full" disabled={!canProceed} onClick={handleSubmit}>
        Next →
      </button>
    </div>
  )
}
