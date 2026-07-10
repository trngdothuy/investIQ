import { createFileRoute } from '@tanstack/react-router'
import QuestionnaireLayout from '../components/questionnaireLayout'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicy,
})

function PrivacyPolicy() {
  return (
    <QuestionnaireLayout>
      <main className="policy-page">
        <div className="policy-card">
          {/* Hero */}
          <div className="policy-hero">
            <div className="policy-badge">🛡 Legal Information</div>

            <h1>Privacy Policy</h1>

            <div className="policy-divider"></div>

            <p className="policy-subtitle">
              Learn how InvestIQ collects, stores, and uses your information while you use the
              platform.
            </p>

            <p className="policy-date">Last updated • July 2026</p>
          </div>

          {/* Information We Collect */}
          <section className="policy-section">
            <div className="policy-icon">👤</div>

            <div className="policy-content">
              <h2>1. Information We Collect</h2>

              <p className="policy-text">
                InvestIQ collects information that you voluntarily provide while using the platform.
                This may include your name, age, current situation, investment goals, investment
                time horizon, contribution frequency, risk preferences, portfolio holdings, and
                environmental or social investment preferences. We only collect information that is
                necessary to personalize your experience and generate your investment insights.
              </p>
            </div>
          </section>

          <div className="policy-divider-line"></div>

          {/* How We Use */}
          <section className="policy-section">
            <div className="policy-icon">📊</div>

            <div className="policy-content">
              <h2>2. How We Use Your Information</h2>

              <p className="policy-text">
                Your information is used to generate portfolio insights, personalize
                recommendations, improve the platform, and provide educational investment analysis.
              </p>
            </div>
          </section>

          <div className="policy-divider-line"></div>

          {/* Storage */}
          <section className="policy-section">
            <div className="policy-icon">🗄️</div>

            <div className="policy-content">
              <h2>3. How We Store Your Information</h2>

              <p className="policy-text">
                While completing the questionnaire, your progress is temporarily saved in your
                browser using Local Storage so that you can continue where you left off if you leave
                or refresh the page.
              </p>

              <p className="policy-text">
                When you submit your questionnaire, your responses are securely transmitted to our
                backend, where they are stored in our database and used to generate your
                personalized investment analysis and dashboard. InvestIQ does not sell your personal
                information to third parties.
              </p>
            </div>
          </section>

          <div className="policy-divider-line"></div>

          {/* Choices */}
          <section className="policy-section">
            <div className="policy-icon">🔒</div>

            <div className="policy-content">
              <h2>4. Your Choices</h2>

              <p className="policy-text">
                You may restart your questionnaire at any time, which clears your locally stored
                questionnaire data from your browser. Future versions of InvestIQ will provide
                additional options for accessing, updating, exporting, or deleting your personal
                information in accordance with applicable privacy laws.
              </p>
            </div>
          </section>

          <div className="policy-divider-line"></div>

          {/* Contact */}
          <section className="policy-section">
            <div className="policy-icon">✉️</div>

            <div className="policy-content">
              <h2>5. Contact</h2>

              <p className="policy-text">
                If you have questions about this Privacy Policy or how your data is handled, please
                contact the InvestIQ team.
              </p>
            </div>
          </section>

          {/* Notice */}
          <div className="policy-notice">
            <div className="policy-notice-icon">🛡️</div>

            <div>
              <h3>Important Notice</h3>

              <p>
                InvestIQ is currently a Minimum Viable Product (MVP) developed for educational and
                research purposes. At this stage, the platform supports U.S. stock market analysis
                only. Our privacy practices, features, and data handling processes may evolve as
                InvestIQ continues to grow and additional functionality is introduced.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="policy-footer">
            <button
              type="button"
              className="btn btn-outline btn-wide"
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
