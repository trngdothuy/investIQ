import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'
import QuestionnaireLayout from '../../components/questionnaireLayout'
import ProgressHeader from '../../components/progressHeader'
import QuestionBlock from '../../components/questionBlock'

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

function Batch2() {
  const navigate = useNavigate()
  const { answers, updateAnswers } = useQuestionnaire()

  const [reason, setReason] = useState(answers.reason ?? '')
  const [horizon, setHorizon] = useState(answers.horizon ?? '')
  const [contributionFrequency, setContributionFrequency] = useState(
    answers.contributionFrequency ?? '',
  )

  const canProceed = reason !== '' && horizon !== '' && contributionFrequency !== ''

  const isComplete = canProceed

  function handleNext() {
    updateAnswers({
      reason,
      horizon,
      contributionFrequency,
    })

    navigate({ to: '/questionnaireBatches/batch3' })
  }

  return (
    <QuestionnaireLayout>
      <ProgressHeader title="Investment Goals" step={2} totalSteps={5} />

      {/* Q4 */}
      <div className="mb-6">
        <label className="block font-medium mb-3">4. What is your main reason for investing?</label>
        <ChipGroup options={reasonOptions} selected={reason} onSelect={setReason} />
      </div>

      {/* Q5 */}
      <QuestionBlock
        title="How long are you planning to keep your money invested?"
        helper="Your investment timeline helps us suggest an appropriate level of risk."
        completed={!!horizon}
      >
        <div className="q-options">
          {horizonOptions.map((option) => {
            const isLong = option.length > 28

            return (
              <button
                key={option}
                type="button"
                onClick={() => setHorizon(option)}
                className={`q-option-btn ${horizon === option ? 'active' : ''}`}
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

      {/* Q6 */}
      <QuestionBlock
        title="How often do you currently add money to your investments?"
        helper="Regular contributions can influence your long-term investment outcomes."
        completed={!!contributionFrequency}
      >
        <div className="q-options">
          {contributionOptions.map((option) => {
            const isLong = option.length > 28

            return (
              <button
                key={option}
                type="button"
                onClick={() => setContributionFrequency(option)}
                className={`q-option-btn ${contributionFrequency === option ? 'active' : ''}`}
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

      {/* Navigation */}
      <div className="q-nav-actions mt-12 flex justify-between gap-4">
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => navigate({ to: '/questionnaireBatches/batch1' })}
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
