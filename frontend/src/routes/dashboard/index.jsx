import { createFileRoute } from '@tanstack/react-router'

import './dashboard.css'

export const Route = createFileRoute('/dashboard/')({
  component: Dashboard,
})

function Dashboard() {
  // ===============================
  // Portfolio Data (Mock Data)
  // Replace with backend API later
  // ===============================

  const holdings = [
    {
      name: 'Apple',
      allocation: 24,
      change: '+3.2%',
      sector: 'Technology',
    },
    {
      name: 'Microsoft',
      allocation: 18,
      change: '+2.1%',
      sector: 'Technology',
    },
    {
      name: 'NVIDIA',
      allocation: 16,
      change: '+5.4%',
      sector: 'Technology',
    },
    {
      name: 'Tesla',
      allocation: 11,
      change: '-1.6%',
      sector: 'Consumer',
    },
    {
      name: 'Amazon',
      allocation: 9,
      change: '+1.8%',
      sector: 'Consumer',
    },
    {
      name: 'JPMorgan',
      allocation: 10,
      change: '+0.9%',
      sector: 'Finance',
    },
    {
      name: 'Johnson & Johnson',
      allocation: 7,
      change: '+2.5%',
      sector: 'Healthcare',
    },
    {
      name: 'Exxon Mobil',
      allocation: 5,
      change: '-0.8%',
      sector: 'Energy',
    },
  ]

  const analysis = {
    riskTolerance: {
      score: 75,
      profile: 'Aggressive',
    },

    portfolioRisk: {
      score: 62,
      profile: 'High',
      reasons: [
        'Large concentration in Technology sector.',
        'One investment represents a large share of the portfolio.',
      ],
    },

    riskComparison: {
      status: 'Good',
      direction: 'Portfolio is aligned with your tolerance',
    },
  }
  // ===============================
  // Portfolio Summary
  // ===============================

  const portfolioValue = 52340
  const totalProfit = 8145
  const annualReturn = 18.4

  const beta = 1.12
  const totalInvested = 44195
  const numberOfHoldings = holdings.length
  const { riskTolerance, portfolioRisk, riskComparison } = analysis

  // ===============================
  // Sector Allocation
  // ===============================

  const sectorColors = {
    Technology: '#4f46e5',
    Healthcare: '#22c55e',
    Finance: '#f59e0b',
    Consumer: '#ef4444',
    Energy: '#06b6d4',
  }

  const sectors = Object.values(
    holdings.reduce((acc, stock) => {
      if (!acc[stock.sector]) {
        acc[stock.sector] = {
          name: stock.sector,
          value: 0,
          color: sectorColors[stock.sector],
        }
      }

      acc[stock.sector].value += stock.allocation

      return acc
    }, {}),
  )

  // ===============================
  // Diversification Score (HHI)
  // ===============================

  const hhi = holdings.reduce((sum, stock) => {
    const weight = stock.allocation / 100
    return sum + weight * weight
  }, 0)

  const diversificationScore = Math.round((1 - hhi) * 100)

  // ===============================
  // Risk Score
  // ===============================

  const concentrationPenalty = hhi * 20
  const betaPenalty = beta

  const riskScore = Math.min(
    10,
    Math.max(1, Number((concentrationPenalty + betaPenalty).toFixed(1))),
  )

  const riskLevel = riskScore < 4 ? 'Low' : riskScore < 7 ? 'Medium' : 'High'

  const diversificationLabel =
    diversificationScore >= 80
      ? 'Well Diversified'
      : diversificationScore >= 60
        ? 'Moderately Diversified'
        : 'Highly Concentrated'

  // ===============================
  // Portfolio Intelligence
  // ===============================

  const largestHolding = holdings.reduce((a, b) => (a.allocation > b.allocation ? a : b))
  const topHoldings = [...holdings].toSorted((a, b) => b.allocation - a.allocation).slice(0, 3)

  const largestSector = sectors.reduce((a, b) => (a.value > b.value ? a : b))

  const insights = [
    `Largest holding is ${largestHolding.name} (${largestHolding.allocation}%).`,
    `${largestSector.name} represents ${largestSector.value}% of your portfolio.`,
    `Diversification score is ${diversificationScore}/100, indicating a ${diversificationLabel.toLowerCase()}.`,
    `Overall portfolio risk is ${riskLevel}.`,
    `Consider increasing exposure to Healthcare or Energy to reduce concentration risk.`,
  ]

  return (
    <div className="dashboard">
      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <div>
          <h1>Portfolio Dashboard</h1>
          <p>Track your investments, portfolio health, and AI-powered insights.</p>
        </div>

        <button className="refresh-btn">Refresh Portfolio</button>
      </div>

      {/* ================= METRICS ================= */}

      <div className="metrics-grid">
        <MetricCard
          title="Portfolio Value"
          value={`$${portfolioValue.toLocaleString()}`}
          change="+8.2%"
          positive
        />
        <MetricCard
          title="Total Invested"
          value={`$${totalInvested.toLocaleString()}`}
          subtitle="Initial Investment"
        />

        <MetricCard
          title="Total Return"
          value={`${annualReturn}%`}
          change={`$${totalProfit.toLocaleString()}`}
          positive
        />

        <MetricCard
          title="Diversification Score"
          value={`${diversificationScore} / 100`}
          subtitle={diversificationLabel}
        />
        <MetricCard title="Holdings" value={numberOfHoldings} subtitle="Individual Stocks" />
      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="dashboard-content">
        {/* LEFT COLUMN */}

        <div className="left-column">
          <div className="dashboard-card">
            <h2>
              Top 3 Holdings
              <InfoTooltip text="Shows the three largest investments in your portfolio by allocation percentage." />
            </h2>

            <div className="top-holdings-list">
              {topHoldings.map((stock, index) => (
                <div className="holding-row" key={stock.name}>
                  <div className="holding-rank">#{index + 1}</div>

                  <div className="holding-info">
                    <strong>{stock.name}</strong>
                    <span>{stock.sector}</span>
                  </div>

                  <div className="holding-stats">
                    <strong>{stock.allocation}%</strong>

                    <span className={stock.change.startsWith('+') ? 'positive' : 'negative'}>
                      {stock.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="right-column">
          {/* Allocation */}
          <div className="dashboard-card">
            <h2>
              Risk Tolerance
              <InfoTooltip text="Your preferred investment risk level based on your questionnaire responses." />
            </h2>

            <div className="tolerance-score">
              <h1>{riskTolerance.score}/100</h1>

              <span>{riskTolerance.profile}</span>
            </div>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${riskTolerance.score}%`,
                }}
              />
            </div>

            <p>Based on your questionnaire responses, your risk preference is classified as:</p>

            <strong>{riskTolerance.profile} Investor</strong>
          </div>

          <div className="dashboard-card">
            <h2>
              Risk Assesment
              <InfoTooltip text="Compares your personal risk tolerance with the actual risk level of your portfolio." />
            </h2>

            <div className="comparison">
              <div>
                <span>Your Tolerance</span>
                <strong>{riskTolerance.score}/100</strong>
              </div>

              <div>
                <span>Portfolio Risk</span>
                <strong>{portfolioRisk.score}/100</strong>
              </div>
            </div>

            <div className={`match-status ${riskComparison.status.toLowerCase()}`}>
              {riskComparison.status}
            </div>
          </div>
          <div className="dashboard-card">
            <h2>
              Sector Allocation
              <InfoTooltip text="Displays how your investments are distributed across different market sectors." />
            </h2>

            {sectors.map((sector) => (
              <div className="sector-row" key={sector.name}>
                <div className="sector-label">
                  <span className="sector-dot" style={{ background: sector.color }} />

                  {sector.name}
                </div>

                <strong>{sector.value}%</strong>
              </div>
            ))}
          </div>

          {/* Portfolio Risk */}

          <div className="dashboard-card">
            <h2>
              Portfolio Risk
              <InfoTooltip text="Measures portfolio risk using factors like concentration and market sensitivity (beta)." />
            </h2>

            <div className="risk-item">
              <span>Risk Score</span>
              <strong>{riskScore}/10</strong>
            </div>

            <div className="risk-item">
              <span>Beta</span>
              <strong>{beta}</strong>
            </div>
          </div>

          {/* AI Insights */}

          <div className="dashboard-card">
            <h2>
              {' '}
              Suggestions Tab
              <InfoTooltip text="AI-generated insights highlighting possible improvements and risks in your portfolio." />{' '}
            </h2>

            <ul className="insight-list">
              {insights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="disclaimer">
        ⚠️ The insights and recommendations in this dashboard are generated by AI to support your
        decision-making. They are intended as a reference and should be used alongside your own
        research and judgment
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, subtitle, positive }) {
  return (
    <div className="metric-card">
      <h3>{title}</h3>

      <h1>{value}</h1>

      {change && <p className={positive ? 'positive' : 'negative'}>{change}</p>}

      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}
function InfoTooltip({ text }) {
  return (
    <span className="info-tooltip">
      ?<span className="tooltip-text">{text}</span>
    </span>
  )
}
