import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'

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

function ChipGroup({
  options,
  selected,
  onSelect,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => onSelect(opt)}
          className={`px-4 py-2 rounded border-2 text-sm cursor-pointer transition-all
            ${
              selected?.label === opt.label
                ? 'border-primary bg-primary text-primary-content font-semibold'
                : 'border-base-300 hover:border-primary/50'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function Batch3() {
  const navigate = useNavigate()
  const { answers, updateAnswers } = useQuestionnaire()

  const [portfolioDrop, setPortfolioDrop] = useState(
    answers.portfolioDrop ?? null,
  )
  const [comfortLevel, setComfortLevel] = useState(
    answers.comfortLevel ?? null,
  )
  const [monthlySwing, setMonthlySwing] = useState(
    answers.monthlySwing ?? null,
  )
  const [returnsPriority, setReturnsPriority] = useState(
    answers.returnsPriority ?? null,
  )

  const canProceed = !!(portfolioDrop && comfortLevel && monthlySwing && returnsPriority)

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
    })
    navigate({ to: '/questionnaireBatches/batch4' })
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-6">
      <p className="text-sm text-base-content/50 mb-1">Risk Profile</p>
      <p className="text-sm text-base-content/50 mb-4 italic">Step 3 of 5</p>
      <progress className="progress progress-primary w-full mb-8" value={75} max={100} />

      {/* Q7 */}
      <div className="mb-6">
        <p className="block font-medium mb-3">
          7. Imagine your portfolio drops 20% in value. What would you most likely do?
        </p>
        <ChipGroup options={q7Options} selected={portfolioDrop} onSelect={setPortfolioDrop} />
      </div>

      {/* Q8 */}
      <div className="mb-6">
        <p className="block font-medium mb-3">
          8. How would you describe your comfort level with investment risk?
        </p>
        <ChipGroup options={q8Options} selected={comfortLevel} onSelect={setComfortLevel} />
      </div>

      {/* Q9 */}
      <div className="mb-6">
        <p className="block font-medium mb-3">
          9. How would you feel if your portfolio's value swung up or down by 15% in a single month?
        </p>
        <ChipGroup options={q9Options} selected={monthlySwing} onSelect={setMonthlySwing} />
      </div>

      {/* Q10 */}
      <div className="mb-8">
        <p className="block font-medium mb-3">
          10. When it comes to returns and risk, what matters most to you?
        </p>
        <ChipGroup options={q10Options} selected={returnsPriority} onSelect={setReturnsPriority} />
      </div>

      <button className="btn btn-primary w-full" disabled={!canProceed} onClick={handleNext}>
        Next
      </button>
    </div>
  )
}
