import { createFileRoute } from '@tanstack/react-router'
import QuestionnaireLayout from '../components/questionnaireLayout'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicy,
})

function PrivacyPolicy() {
  return (
    <QuestionnaireLayout>
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl bg-base-100 shadow-xl border border-base-200 p-8 md:p-12">

          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-5">
              Privacy Policy
            </h1>

            <div className="badge badge-primary badge-outline mb-6">
              Legal Information
            </div>

            <p className="text-base leading-8 text-base-content/80 max-w-3xl">
              Learn how InvestIQ collects, stores, and uses your information while you use the
              platform.
            </p>

            <p className="mt-6 text-sm uppercase tracking-widest text-base-content/50">
              Last updated • July 2026
            </p>
          </div>

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-emerald-600 mb-5">
              Information We Collect
            </h2>

            <p className="text-base leading-8 text-base-content/80 max-w-3xl">
              InvestIQ collects information that you voluntarily provide while using the platform. This may include your name, age, current situation, investment goals, investment time horizon, contribution frequency, risk preferences, portfolio holdings, and environmental or social investment preferences. We only collect information that is necessary to personalize your experience and generate your investment insights.
            </p>
          </section>

          <hr className="border-base-200 my-12" />

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-emerald-600 mb-5">
              How We Use Your Information
            </h2>

            <p className="leading-8 text-base-content/80">
              Your information is used to generate portfolio insights,
              personalize recommendations, improve the platform, and provide
              educational investment analysis.
            </p>
          </section>

          <hr className="border-base-200 my-12" />

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-emerald-600 mb-5">
              How We Store Your Information
            </h2>

            <p className="leading-8 text-base-content/80 mb-6">
              While completing the questionnaire, your progress is temporarily saved in
              your browser using Local Storage so that you can continue where you left off
              if you leave or refresh the page.
            </p>

            <p className="leading-8 text-base-content/80">
              When you submit your questionnaire, your responses are securely transmitted to
              our backend, where they are stored in our database and used to generate your
              personalized investment analysis and dashboard. InvestIQ does not sell your
              personal information to third parties.
            </p>
          </section>
    
          <hr className="border-base-200 my-12" />

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-emerald-600 mb-5">
              Your Choices
            </h2>

            <p className="leading-8 text-base-content/80">
              You may restart your questionnaire at any time, which clears your locally stored questionnaire data from your browser. Future versions of InvestIQ will provide additional options for accessing, updating, exporting, or deleting your personal information in accordance with applicable privacy laws.
            </p>
          </section>

          <hr className="border-base-200 my-12" />

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-emerald-600 mb-5">
              Contact
            </h2>

            <p className="leading-8 text-base-content/80">
              If you have questions about this Privacy Policy or how your data
              is handled, please contact the InvestIQ team.
            </p>
          </section>

          <hr className="border-base-200 my-12" />

          <div className="mt-16 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50 p-6 shadow-sm">
            <h3 className="font-semibold text-blue-900 mb-3">
              Important Notice
            </h3>

            <p className="text-sm leading-7 text-blue-800">
              InvestIQ is currently a Minimum Viable Product (MVP) developed for
              educational and research purposes. At this stage, the platform supports
              U.S. stock market analysis only. Our privacy practices, features, and data
              handling processes may evolve as InvestIQ continues to grow and additional
              functionality is introduced.
            </p>
          </div>

                    <div className="border-t border-base-200 pt-8 mt-10 flex justify-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.history.back()}
            >
              ← Back
            </button>
          </div>

        </div>
      </main>
    </QuestionnaireLayout>
  )
}