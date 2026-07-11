import { createFileRoute } from '@tanstack/react-router'
import '../dashboard.css'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const storedQuestionnaire = localStorage.getItem('questionnaire')
  console.log(storedQuestionnaire)

  if (!storedQuestionnaire) {
    return <p>No portfolio analysis found.</p>
  }

  const data = JSON.parse(storedQuestionnaire)
  const name = data.name
  const analysis = data.analysis
  // const aiSuggestions = data.analysis.suggestions

  const {
    portfolioSummary,
    totalPortfolioValue,
    portfolioChange,
    topHoldings,
    assetAllocation,
    sectorExposure,
    diversification,
    riskTolerance,
    portfolioRisk,
    riskComparison,
    environmentalImpact,
    socialImpact,
    aiSuggestions,
  } = analysis

  const holdings = portfolioSummary.holdings

  // ===============================
  // Portfolio Summary
  // ===============================

  const portfolioValue = totalPortfolioValue
  const totalInvested = portfolioSummary.totalInvestment
  const numberOfHoldings = portfolioSummary.numberOfHoldings

  const allocationMap = Object.fromEntries(
    assetAllocation.map((item) => [item.ticker, item.percentage]),
  )

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
  const COLORS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4']
  const sectors = Object.entries(sectorExposure).map(([sector, value]) => ({
    sector,
    percentage: value.percentage,
  }))

  const statusIcons = {
    positive: '✅ ',
    warning: '⚠️ ',
    info: 'ℹ️ ',
  }

  if (!analysis) {
    return <p>No portfolio analysis found.</p>
  }

  return (
    <div className="dashboard">
      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <div>
          <h1>Welcome {name} 👋</h1>
          <h1>Portfolio Dashboard</h1>
          <p>Understand your investments. Make better decisions with AI-powered suggestions.</p>
          <div className="disclaimer">⚠️ The results are for educational purposes only.</div>
        </div>
      </div>

      {/* ================= METRICS ================= */}

      <div className="metrics-grid">
        <MetricCard
          title="Portfolio Value"
          value={`$${portfolioValue.toLocaleString()}`}
          change={`Overall Change: ${portfolioChange >= 0 ? '+' : ''}${portfolioChange.toFixed(2)}%`}
          positive={portfolioChange >= 0}
        />
        <MetricCard
          title="Total Invested"
          value={`$${totalInvested.toLocaleString()}`}
          subtitle="Initial Investment"
        />

        <MetricCard title="Holdings" value={numberOfHoldings} subtitle="Individual Stocks" />
      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="dashboard-content">
        {/* Stock Allocation */}
        <div className="dashboard-card stock-allocation-card">
          <h2>
            Stock Allocation
            <InfoTooltip text="Shows how your portfolio is distributed across each stock." />
          </h2>

          <div className="stock-allocation-list">
            {holdings.map((stock) => (
              <div key={stock.name} className="stock-allocation-item">
                <div className="stock-allocation-header">
                  <div>
                    <strong>{stock.name}</strong>
                    <p>{stock.ticker}</p>
                  </div>

                  <span>{allocationMap[stock.ticker]}%</span>
                </div>

                <div className="allocation-bar">
                  <div
                    className="allocation-fill"
                    style={{
                      width: `${allocationMap[stock.ticker]}%`,
                      backgroundColor: sectorColors[stock.sector] ?? '#22c55e',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* LEFT COLUMN */}

        {/* <div className="left-column"> */}

        {/* </div> */}

        {/* RIGHT COLUMN */}

        <div className="right-column">
          {/* Top 3 holdings */}
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
                    <span>{stock.ticker}</span>
                  </div>

                  <div className="holding-stats">
                    <strong>{allocationMap[stock.ticker]}%</strong>

                    {/* <span className={stock.change.startsWith('+') ? 'positive' : 'negative'}>
                      {stock.change}
                    </span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Exposure */}

          <div className="dashboard-card">
            <h2>
              Sector Exposure
              <InfoTooltip text="Displays how your investments are distributed across different market sectors." />
            </h2>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={sectors}
                    dataKey="percentage"
                    nameKey="sector"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {sectors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Environmental & Social Impact */}

          <div className="dashboard-card">
            <h2>
              Environmental Impact
              <InfoTooltip text="How your portfolio aligns with environmentally friendly industries." />
            </h2>

            <div className={`impact-status ${environmentalImpact.status.toLowerCase()}`}>
              {environmentalImpact.status}
            </div>

            <p>{environmentalImpact.message}</p>
          </div>

          <div className="dashboard-card">
            <h2>
              Social Impact
              <InfoTooltip text="Whether your portfolio aligns with the ethical values you selected." />
            </h2>

            <div className={`impact-status ${socialImpact.status.toLowerCase()}`}>
              {socialImpact.status}
            </div>

            <p>{socialImpact.message}</p>
          </div>

          <div className="dashboard-card">
            <h2>
              Diversification Score
              <InfoTooltip text="Indicates how well your investments are spread across different assets, reducing risk." />
            </h2>

            <div className="tolerance-score">
              <h1>{diversification.score}/100</h1>

              <span className={`match-status ${diversification.interpretation}`}>
                {diversification.interpretation}
              </span>
            </div>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${diversification.score}%`,
                }}
              />
            </div>

            <p>Diversification breakdown:</p>

            <ul>
              <li>- Holding Score: {diversification.breakdown.holdingsScore}/100</li>
              <li>- Concentration Score: {diversification.breakdown.concentrationScore}/100</li>
              <li>- Sector Score: {diversification.breakdown.sectorScore}/100</li>
            </ul>
          </div>

          {/* Portfolio Risk */}
          <div className="dashboard-card">
            <h2>
              Risk Tolerance
              <InfoTooltip text="Your preferred investment risk level based on your questionnaire responses." />
            </h2>

            <div className="tolerance-score">
              <h1>{riskTolerance.score}/100</h1>

              <span className={`match-status ${riskTolerance.profile}`}>
                {riskTolerance.profile}
              </span>
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

            <strong>{riskTolerance.profile} Risk Tolerance</strong>
          </div>

          <div className="dashboard-card">
            <h2>
              Portfolio Risk
              <InfoTooltip text="Your preferred investment risk level based on your questionnaire responses." />
            </h2>

            <div className="tolerance-score">
              <h1>{portfolioRisk.score}/100</h1>

              <span className={`match-status ${portfolioRisk.profile}`}>
                {portfolioRisk.profile}
              </span>
            </div>

            <div className="progress">
              <div
                className="progress-fill"
                style={{
                  width: `${portfolioRisk.score}%`,
                }}
              />
            </div>

            <strong>{portfolioRisk.profile} Portfolio Risk</strong>

            <p>Reasons for risk score:</p>
            <ul>
              {portfolioRisk.reasons.map((reason) => (
                <li key={reason}>- {reason}</li>
              ))}
            </ul>
          </div>

          <div className="dashboard-card">
            <h2>
              Risk Assessment
              <InfoTooltip text="Compares your personal risk tolerance with the actual risk level of your portfolio." />
            </h2>

            <div className="comparison">
              <div className={`match-status ${riskTolerance.profile}`}>
                <span>Your Tolerance</span>
                <strong>{riskTolerance.score}/100</strong>
              </div>

              <div className={`match-status ${portfolioRisk.profile}`}>
                <span>Portfolio Risk</span>
                <strong>{portfolioRisk.score}/100</strong>
              </div>
            </div>

            <div className={`match-status ${riskComparison.status.toLowerCase()}`}>
              Difference: {riskComparison.difference}
            </div>

            <div className={`match-status ${riskComparison.status.toLowerCase()}`}>
              Status: {riskComparison.status}
            </div>

            <br />
            {/* <p>Reasons for risk score::</p> */}

            <strong>{riskComparison.direction}</strong>
          </div>

          {/* AI Insights */}

          <div className="dashboard-card">
            <h2>
              {' '}
              Suggestions
              <InfoTooltip text="AI-generated insights highlighting possible improvements and risks in your portfolio." />{' '}
            </h2>
            <div className="disclaimer">
              ⚠️ The recommendations are generated by AI to support your decision-making. They are
              intended as a reference and should be used alongside your own research and judgment.
            </div>

            <ul className="insight-list">
              {aiSuggestions.map((item) => (
                <li key={item.title} className={`match-suggestion-status ${item.type}`}>
                  <span>{statusIcons[item.type] || 'ℹ️'}</span>
                  <strong>{item.title}</strong>
                  <br />
                  {item.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
