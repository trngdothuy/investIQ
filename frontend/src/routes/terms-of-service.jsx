import { createFileRoute } from '@tanstack/react-router'

import QuestionnaireLayout from '../components/questionnaireLayout'

export const Route = createFileRoute('/terms-of-service')({
  component: TermsOfService,
})

function TermsOfService() {
  return (
    <QuestionnaireLayout>
      <main className="policy-page">
        <div className="policy-card">
          {/* Hero */}
          <div className="policy-hero">
            <div className="policy-badge">⚖️ Legal Information</div>

            <h1>Terms of Service</h1>

            <div className="policy-divider"></div>

            <p className="policy-subtitle">
              These terms explain the conditions for using InvestIQ and the limitations of the
              information we provide.
            </p>

            <p className="policy-date">Last updated • July 2026</p>
          </div>

          {/* Educational Purpose */}
          <section className="policy-section">
            <div className="policy-icon">🎓</div>

            <div className="policy-content">
              <h2>1. Educational Purpose</h2>

              <p className="policy-text">
                InvestIQ is an educational platform designed to help users better understand
                investment portfolios and environmental and social considerations. It does not
                provide financial advice.
              </p>
            </div>
          </section>

          <div className="policy-divider-line"></div>

          {/* No Investment Advice */}
          <section className="policy-section">
            <div className="policy-icon">📈</div>

            <div className="policy-content">
              <h2>2. No Investment Advice</h2>

              <p className="policy-text">
                Information provided by InvestIQ should not be considered financial, legal, tax, or
                investment advice. Users remain responsible for their own investment decisions.
              </p>
            </div>
          </section>

          <div className="policy-divider-line"></div>

          {/* Accuracy */}
          <section className="policy-section">
            <div className="policy-icon">✔️</div>

            <div className="policy-content">
              <h2>3. Accuracy</h2>

              <p className="policy-text">
                While we strive to provide accurate portfolio analysis, market data, calculations,
                and educational content, InvestIQ cannot guarantee that all information is complete,
                current, or error-free.
              </p>
            </div>
          </section>

          <div className="policy-divider-line"></div>

          {/* Liability */}
          <section className="policy-section">
            <div className="policy-icon">🛡️</div>

            <div className="policy-content">
              <h2>4. Limitation of Liability</h2>

              <p className="policy-text">
                InvestIQ and its contributors are not liable for any financial losses or damages
                resulting from the use of this platform or reliance on the information it provides.
              </p>
            </div>
          </section>

          <div className="policy-divider-line"></div>

          {/* Acceptance */}
          <section className="policy-section">
            <div className="policy-icon">✅</div>

            <div className="policy-content">
              <h2>5. Acceptance</h2>

              <p className="policy-text">
                By using InvestIQ, you agree to these Terms of Service and our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Notice */}
          <div className="policy-notice">
            <div className="policy-notice-icon">ℹ️</div>

            <div>
              <h3>Important Notice</h3>

              <p>
                InvestIQ is currently a Minimum Viable Product (MVP). These terms may be updated as
                the platform evolves and additional features become available.
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
