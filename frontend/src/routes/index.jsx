import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

// File name determines the URL path:  index.tsx → "/"
export const Route = createFileRoute('/')({
  component: HomePage,
})

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <h1 className="font-bold text-lg text-emerald-600 hero-title">InvestIQ</h1>
        <br />
        <div className="badge">Built for retail investors</div>
        <h1 className="hero-title">
          Invest with <span className="gradient-text">clarity, confidence</span>
          <br />
          and conscience.
        </h1>

        <p className="hero-description">
          InvestIQ helps retail investors understand portfolio risk, diversification, and social
          impacts through interactive learning and personalized recommendations.
        </p>

        <p className="market-note">
          🇺🇸 Currently supports <strong>U.S. stock market investments only. </strong>
          Global markets will be supported in future releases.
        </p>

        <div className="hero-actions">
          <Link to="/questionnaire" className="primary-btn">
            Get Started →
          </Link>
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

          <h3>Environmental and Social Impacts</h3>

          <p>Evaluate environmental and social factors before making investment decisions.</p>
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
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What users are saying</h2>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              ★★★★★ <span className="rating-number">5</span>
            </div>
            <p>
              “InvestIQ helped me finally understand how diversified my portfolio actually was.
              Super clear and beginner-friendly.”
            </p>
            <span className="testimonial-author">— Sarah M.</span>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              ★★★★★ <span className="rating-number">5</span>
            </div>
            <p>
              “I used to invest randomly. Now I actually understand risk and sector exposure. Game
              changer.”
            </p>
            <span className="testimonial-author">— Daniel K.</span>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              ★★★★☆ <span className="rating-number">4.8</span>{' '}
            </div>
            <p>
              “The environmental and social impact insights make me feel more confident that my
              investments align with my values.”
            </p>
            <span className="testimonial-author">— Priya S.</span>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          {/* Brand */}
          <div className="footer-brand">
            <h3>InvestIQ</h3>
            <p>
              Smarter investing through clarity, education, and environmental and social impact
              awareness.
            </p>
          </div>

          {/* Links */}
          <div className="footer-links">
            <div className="footer-column">
              <h4>Legal</h4>

              <button type="button" className="footer-link">
                Privacy Policy
              </button>

              <button type="button" className="footer-link">
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} InvestIQ. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
