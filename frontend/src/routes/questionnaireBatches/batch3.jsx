import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'
import QuestionnaireLayout from '../../components/questionnaireLayout'
import ProgressHeader from '../../components/progressHeader'
import QuestionBlock from '../../components/questionBlock'

export const Route = createFileRoute('/questionnaireBatches/batch3')({
  component: Batch3,
})

const q7Options = [
  { label: "Sell everything, I don't want to lose more", score: 1 },
  { label: 'Sell some and move to safer options', score: 2 },
  { label: 'Do nothing and wait for it to recover', score: 3 },
  { label: "Buy more, it's a good opportunity", score: 4 },
]

const q8Options = [
  { label: 'Very low — I prefer certainty over growth', score: 1 },
  { label: 'Low — small fluctuations are okay', score: 2 },
  { label: 'Medium — I can handle moderate ups and downs', score: 3 },
  { label: "High — I'm comfortable with significant swings for higher returns", score: 4 },
]

const q9Options = [
  { label: 'Very uncomfortable — that level of change would stress me out', score: 1 },
  { label: "Somewhat uncomfortable — I'd rather have steadier returns", score: 2 },
  { label: "Neutral — I understand it's part of investing", score: 3 },
  { label: "Comfortable — short-term swings don't bother me", score: 4 },
]

const q10Options = [
  { label: 'I want to protect my money, even if it grows slowly', score: 1 },
  { label: "I'm okay with some ups and downs for moderate growth", score: 2 },
  { label: 'I want strong growth, and I can handle big swings', score: 3 },
  { label: 'I want the highest possible returns, even with major volatility', score: 4 },
]

function getRiskProfile(score) {
  if (score <= 7) return 'Conservative'
  if (score <= 11) return 'Moderate'
  return 'Aggressive'
}

export default function Batch3() {
  const navigate = useNavigate()
  const { answers, updateAnswers } = useQuestionnaire()

  const [portfolioDrop, setPortfolioDrop] = useState(answers.portfolioDrop ?? null)
  const [comfortLevel, setComfortLevel] = useState(answers.comfortLevel ?? null)
  const [monthlySwing, setMonthlySwing] = useState(answers.monthlySwing ?? null)
  const [returnsPriority, setReturnsPriority] = useState(answers.returnsPriority ?? null)

  const canProceed =
    !!portfolioDrop &&
    !!comfortLevel &&
    !!monthlySwing &&
    !!returnsPriority

  function handleNext() {
    const totalScore =
      (portfolioDrop?.score ?? 0) +
      (comfortLevel?.score ?? 0) +
      (monthlySwing?.score ?? 0) +
      (returnsPriority?.score ?? 0)

    updateAnswers({
    portfolioDrop,
    comfortLevel,
    monthlySwing,
    returnsPriority,
    riskScore: totalScore,
    riskProfile: getRiskProfile(totalScore),

    lastCompletedBatch: 3,
  })

    navigate({ to: '/questionnaireBatches/batch4' })
  }

  return (
    <QuestionnaireLayout>
      <ProgressHeader title="Risk Profile" step={3} totalSteps={5} />

      {/* Q7 */}
      <QuestionBlock
        title="7. Imagine your portfolio drops 20% in value. What would you most likely do?"
        helper="This helps us understand your emotional reaction to market downturns."
        completed={!!portfolioDrop}
      >
        <div className="q-options">
          {q7Options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setPortfolioDrop(opt)}
              className={`q-option-btn ${portfolioDrop?.label === opt.label ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </QuestionBlock>

      {/* Q8 */}
      <QuestionBlock
        title="8. How would you describe your comfort level with investment risk?"
        helper="We use this to determine your risk tolerance band."
        completed={!!comfortLevel}
      >
        <div className="q-options">
          {q8Options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setComfortLevel(opt)}
              className={`q-option-btn ${comfortLevel?.label === opt.label ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </QuestionBlock>

      {/* Q9 */}
      <QuestionBlock
        title="9. How would you feel if your portfolio's value swung up or down by 15% in a single month?"
        helper="Short-term volatility helps us understand your behavioural risk profile."
        completed={!!monthlySwing}

      >
        <div className="q-options">
          {q9Options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setMonthlySwing(opt)}
              className={`q-option-btn ${monthlySwing?.label === opt.label ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </QuestionBlock>

      {/* Q10 */}
      <QuestionBlock
        title="10. When it comes to returns and risk, what matters most to you?"
        helper="This helps us balance growth vs stability in your recommendations."
       completed={!!returnsPriority}
      >
        <div className="q-options">
          {q10Options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setReturnsPriority(opt)}
              className={`q-option-btn ${returnsPriority?.label === opt.label ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </QuestionBlock>

      {/* Navigation */}
      <div className="q-nav-actions">
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => navigate({ to: '/questionnaireBatches/batch2' })}
        >
          ← Back
        </button>

        <button
          className="btn btn-primary w-full"
          disabled={!canProceed}
          onClick={handleNext}
        >
          Continue →
        </button>
      </div>
    </QuestionnaireLayout>
  )
}
