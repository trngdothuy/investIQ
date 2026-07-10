import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import QuestionnaireLayout from '../components/questionnaireLayout.jsx'
import { useQuestionnaire } from '../context/questionnaireContext'

export const Route = createFileRoute('/questionnaire')({
  component: QuestionnairePage,
})

function QuestionnairePage() {
  const navigate = useNavigate()
  const { answers, resetAnswers } = useQuestionnaire()

  const hasSavedQuestionnaire = Object.keys(answers).some(
    (key) =>
      ![
        'version',
        'createdAt',
        'updatedAt',
        'lastCompletedBatch',
        'questionnaireCompleted',
      ].includes(key),
  )

  const progress = answers.lastCompletedBatch ?? 0

  const isCompleted = answers.questionnaireCompleted === true

  const progressPercent = isCompleted ? 100 : Math.min(100, Math.round((progress / 5) * 100))

  const lastUpdated = answers.updatedAt
    ? new Date(answers.updatedAt).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  const nextBatch =
    {
      0: '/questionnaireBatches/batch0',
      1: '/questionnaireBatches/batch1',
      2: '/questionnaireBatches/batch2',
      3: '/questionnaireBatches/batch3',
      4: '/questionnaireBatches/batch4',
      5: '/questionnaireBatches/batch5',
    }[progress] ?? '/questionnaireBatches/batch0'

  return (
    <QuestionnaireLayout>
      {/* FULL PAGE CENTERING AREA */}
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        {/* CONTENT CONTAINER */}
        <div className="w-full max-w-2xl text-center flex flex-col items-center gap-10">
          {/* TITLE */}
          <h1 className="text-4xl font-bold text-primary leading-tight">
            Let's build your investment profile
          </h1>

          {/* MAIN TEXT */}
          <p className="text-base-content/70 text-lg leading-relaxed max-w-xl">
            In the next five short steps, we'll learn about your goals, investing style, and current
            portfolio so we can give you personalized insights and help you make more informed
            decisions.
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
          <div className="pt-6 flex flex-col items-center gap-4">
            {hasSavedQuestionnaire && (
              <div className="w-full max-w-lg rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-emerald-700">👋 Welcome back!</h2>

                <p className="mt-2 text-sm text-gray-700">
                  {answers.name ? `Welcome back, ${answers.name}!` : 'Welcome back!'}

                  <br />

                  {isCompleted
                    ? 'Your investment profile is ready. You can view your dashboard or continue editing your answers.'
                    : 'We restored your saved questionnaire so you can continue where you left off.'}
                </p>

                {lastUpdated && (
                  <p className="mt-2 text-xs text-gray-500">Last saved: {lastUpdated}</p>
                )}

                <div className="mt-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>

                    <span>{progressPercent}%</span>
                  </div>

                  <progress
                    className="progress progress-primary w-full"
                    value={progressPercent}
                    max="100"
                  />
                  <p className="mt-3 text-sm text-gray-600">
                    {isCompleted
                      ? '✅ Questionnaire completed'
                      : `Completed ${progress} of 5 steps`}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {isCompleted ? (
                    <>
                      <button
                        className="btn btn-primary flex-1"
                        onClick={() =>
                          navigate({
                            to: '/dashboard',
                          })
                        }
                      >
                        View Dashboard
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary flex-1"
                      onClick={() =>
                        navigate({
                          to: nextBatch,
                        })
                      }
                    >
                      Continue Questionnaire
                    </button>
                  )}

                  <button
                    className="btn btn-outline flex-1"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Start a new questionnaire? This will remove your saved answers.',
                        )
                      ) {
                        resetAnswers()

                        navigate({
                          to: '/questionnaireBatches/batch0',
                        })
                      }
                    }}
                  >
                    Start New
                  </button>
                </div>
              </div>
            )}

            {!hasSavedQuestionnaire && (
              <>
                <button
                  className="btn btn-primary w-64"
                  onClick={() =>
                    navigate({
                      to: '/questionnaireBatches/batch0',
                    })
                  }
                >
                  Get Started
                </button>

                <p className="text-xs text-base-content/50">
                  You can change your answers at any time.
                </p>

                <p className="max-w-md text-center text-xs leading-relaxed text-base-content/60">
                  By continuing, you agree that InvestIQ may temporarily store your questionnaire
                  responses to personalize your experience and generate your investment profile. For
                  more information about how we collect, use, and protect your information, please
                  read our{' '}
                  <Link
                    to="/privacy-policy"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </QuestionnaireLayout>
  )
}
