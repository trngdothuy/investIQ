import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'
import QuestionnaireLayout from '../../components/questionnaireLayout'
import ProgressHeader from '../../components/progressHeader'
import QuestionBlock from '../../components/questionBlock'

export const Route = createFileRoute('/questionnaireBatches/batch4')({
  component: Batch4,
})

/**
 * FUTURE FEATURE (not used in MVP yet)
 * -------------------------------------------------
 * These represent thematic / ESG-style investment preferences.
 * They may later be merged into a "values alignment engine"
 * that enriches portfolio recommendations.
 */
/** const causeOptions = [
  'Clean Energy & Sustainability',
  'Technology & Innovation',
  'Healthcare & Wellness',
  'Education & Opportunity',
  'Human Rights',
  'Social Equality & Community',
  'Renewable Energy',
  'Ethical Business Practices',
  'Local Economic Development',
  'Financial Inclusion',
  'Climate Action',
  'Responsible Corporate Governance',
] **/

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

  const [exclusions, setExclusions] = useState(answers.exclusions ?? [])

  const [highlights, setHighlights] = useState(answers.highlights ?? [])

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
    updateAnswers({
      exclusions,
      highlights,

      lastCompletedBatch: 4,
    })

    navigate({ to: '/questionnaireBatches/batch5' })
  }

  return (
    <QuestionnaireLayout>
      <ProgressHeader title="Portfolio Values & Alignment" step={4} totalSteps={5} />

      {/* Q11 */}
      <QuestionBlock
        title="11. Are there any industries you would prefer to avoid investing in?"
        helper="We use this to ensure your portfolio aligns with your ethical preferences. You can choose as many options as you want."
        completed={exclusions.length > 0}
      >
        <div className="q-options">
          {exclusionOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleExclusion(option)}
              className={`q-option-btn ${exclusions.includes(option) ? 'active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </QuestionBlock>

      {/* Q12 */}
      <QuestionBlock
        title="12. Are there any categories you would like your investments to avoid violating?"
        helper="You can select up to 3 values that matter most to you."
        completed={highlights.length > 0}
      >
        <div className="q-options">
          {highlightOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleHighlight(option)}
              className={`q-option-btn ${highlights.includes(option) ? 'active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </QuestionBlock>

      {/* FUTURE SECTION (COMMENTED OUT) */}
      {/*
      <QuestionBlock
        title="11. What causes would you like your investments to support?"
        helper="Choose up to 5 themes that reflect your values."
      >
        <div className="q-options">
          {causeOptions.map((option) => (
            <button
              key={option}
              type="button"
              className="q-option-btn"
            >
              {option}
            </button>
          ))}
        </div>
      </QuestionBlock>
      */}

      {/* Navigation */}
      <div className="q-nav-actions">
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => navigate({ to: '/questionnaireBatches/batch3' })}
        >
          ← Back
        </button>

        <button className="btn btn-primary w-full" disabled={!canProceed} onClick={handleSubmit}>
          Continue →
        </button>
      </div>
    </QuestionnaireLayout>
  )
}
