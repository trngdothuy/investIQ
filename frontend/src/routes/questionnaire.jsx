import { createFileRoute, useNavigate } from '@tanstack/react-router'
import QuestionnaireLayout from '../components/QuestionnaireLayout'

export const Route = createFileRoute('/questionnaire')({
  component: QuestionnairePage,
})

function QuestionnairePage() {
  const navigate = useNavigate()

  return (
    <QuestionnaireLayout>
      {/* FULL PAGE CENTERING AREA */}
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">

        {/* CONTENT CONTAINER */}
        <div className="w-full max-w-2xl text-center flex flex-col items-center gap-10">

          {/* TITLE */}
          <h1 className="text-4xl font-bold text-primary leading-tight">
            Let’s build your investment profile
          </h1>

          {/* MAIN TEXT */}
          <p className="text-base-content/70 text-lg leading-relaxed max-w-xl">
            In the next five short steps, we'll learn about your goals, investing style, and current
            portfolio so we can give you personalised insights and help you make more informed decisions.
          </p>

          {/* HIGHLIGHT BOX */}
          <div className="w-full max-w-md bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-6 py-4 text-sm font-medium shadow-sm">
            5 short steps • approximately 5-7 minutes
          </div>

          {/* SUPPORT TEXT */}
          <p className="text-sm text-base-content/60 max-w-md">
            No investment knowledge required - we'll guide you through everything.
          </p>

          {/* CTA */}
          <div className="pt-6 flex flex-col items-center gap-3">
            <button
              className="btn btn-primary w-64"
              onClick={() => navigate({ to: '/questionnaireBatches/batch0' })}
            >
              Get Started
            </button>

            <p className="text-xs text-base-content/50">
              You can change your answers at any time
            </p>
          </div>

        </div>
      </div>
    </QuestionnaireLayout>
  )
}