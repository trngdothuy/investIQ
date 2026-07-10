import { Link } from '@tanstack/react-router'

export default function QuestionnaireLayout({ children }) {
  return (
    <div className="q-page">
      {/* Header */}
      <header className="q-header">
        <div className="q-header-container">
          <Link to="/" className="q-logo">
            InvestIQ
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="q-main">
        <div className="q-container q-flow">{children}</div>
      </main>

      {/* Footer */}
      <footer className="footer q-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>InvestIQ</h3>
            <p>
              Smarter investing through clarity, education and environmental & social impact
              awareness.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Legal</h4>
              <Link to="/privacy-policy" className="footer-link">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="footer-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} InvestIQ. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
