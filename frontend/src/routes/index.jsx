import { createFileRoute } from '@tanstack/react-router'
//import './style.css'

// File name determines the URL path:  index.tsx → "/"
export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="badge">Built for beginner investors</div>

        <h1 className="hero-title">
          Invest with <span className="gradient-text">clarity, confidence</span>
          <br />
          and conscience.
        </h1>

        <p className="hero-description">
          InvestIQ helps new investors understand portfolio risk, diversification, and ESG impact
          through interactive learning and personalized recommendations.
        </p>

        <div className="hero-actions">
          <button className="primary-btn">Get Started →</button>
        </div>

        <p className="helper-text">Takes less than 2 minutes • No financial experience required</p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📊</div>

          <h3>Portfolio Analysis</h3>

          <p>Understand diversification, sector allocation and investment concentration.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎓</div>

          <h3>Learn While Investing</h3>

          <p>Beginner-friendly explanations help you build financial literacy as you invest.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌱</div>

          <h3>ESG Insights</h3>

          <p>
            Evaluate environmental, social and governance factors before making investment
            decisions.
          </p>
        </div>
      </section>

      {/* Why InvestIQ */}
      <section className="why-section">
        <h2>Why InvestIQ?</h2>

        <p>
          Many first-time investors focus only on returns. InvestIQ encourages smarter decisions by
          combining financial analysis with sustainability awareness.
        </p>
      </section>
    </main>
  )
}
