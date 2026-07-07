export function analysePortfolio(questionnaire) {
  const portfolio = questionnaire.portfolio ?? []
  const portfolioSummary = calculateTotalInvestment(portfolio)
  const sectorExposure = calculateSectorExposure(portfolio)
  const riskTolerance = calculateRiskTolerance(questionnaire)
  const portfolioRisk = calculatePortfolioRisk(
    portfolioSummary,
    sectorExposure,
    questionnaire
  )

  return {
    portfolioSummary,
    sectorExposure,
    riskTolerance,
    portfolioRisk,
    // more metrics later...
  }
}

export function calculateTotalInvestment(portfolio) {
  let totalInvestment = 0
  let totalShares = 0

  const holdings = portfolio.map((stock) => {
    const quantity = Number(stock.quantity)
    const buyPrice = Number(stock.buyPrice)

    const investment = quantity * buyPrice

    totalInvestment += investment
    totalShares += quantity

    return {
      ticker: stock.ticker,
      name: stock.name,
      quantity,
      buyPrice,
      investment,
    }
  })

  console.log('Portfolio summary:')
  console.log({
    totalInvestment,
    totalShares,
    numberOfHoldings: holdings.length,
    holdings,
  })

  return {
    totalInvestment,
    totalShares,
    numberOfHoldings: holdings.length,
    holdings,
  }
}

export function calculateSectorExposure(portfolio) {
  const sectorExposure = {}
  let totalPortfolioValue = 0

  // First pass: calculate total portfolio value
  for (const stock of portfolio) {
    const value = Number(stock.quantity) * Number(stock.buyPrice)
    totalPortfolioValue += value
  }

  // Second pass: accumulate values by sector
  for (const stock of portfolio) {
    const sector = stock.sector || 'Unknown'
    const value = Number(stock.quantity) * Number(stock.buyPrice)

    if (!sectorExposure[sector]) {
      sectorExposure[sector] = {
        total_value: 0,
        percentage: 0,
      }
    }

    sectorExposure[sector].total_value += value
  }

  // Calculate percentages
  for (const sector in sectorExposure) {
    sectorExposure[sector].percentage = Number(
      ((sectorExposure[sector].total_value / totalPortfolioValue) * 100).toFixed(1),
    )
  }

  console.log('Sector exposure:')
  console.log(sectorExposure)

  return sectorExposure
}

export function calculateRiskTolerance(questionnaire) {
  console.log(`Risk tolerance score: ${questionnaire.riskScore}, Profile: ${questionnaire.riskProfile}`);
  
  return {
    score: questionnaire.riskScore,
    profile: questionnaire.riskProfile,
  };
}

export function calculatePortfolioRisk(
  portfolioSummary,
  sectorExposure,
  questionnaire,
) {
  let score = 0
  const reasons = []

  // 1. Largest sector exposure (30 pts)
  const largestSector = Math.max(
    ...Object.values(sectorExposure).map((s) => s.percentage),
  )

  if (largestSector > 50) {
    score += 30
    reasons.push('More than half of your portfolio is invested in one sector.')
  } else if (largestSector > 35) {
    score += 20
    reasons.push('Large concentration in a single sector.')
  } else if (largestSector > 20) {
    score += 10
  }

  // 2. Number of holdings (20 pts)
  const holdings = portfolioSummary.numberOfHoldings

  if (holdings <= 5) {
    score += 20
    reasons.push('Very few holdings.')
  } else if (holdings <= 10) {
    score += 12
  } else if (holdings <= 20) {
    score += 6
  }

  // 3. Largest position (20 pts)
  const largestInvestment = Math.max(
    ...portfolioSummary.holdings.map((h) => h.investment),
  )

  const largestWeight =
    (largestInvestment / portfolioSummary.totalInvestment) * 100

  if (largestWeight > 40) {
    score += 20
    reasons.push('One investment represents a very large share of the portfolio.')
  } else if (largestWeight > 25) {
    score += 15
    reasons.push('One investment represents a large share of the portfolio.')
  } else if (largestWeight > 15) {
    score += 8
  }

  // 4. Investment horizon (10 pts)
  switch (questionnaire.horizon) {
    case 'Less than 1 year':
      score += 10
      reasons.push('Very short investment horizon.')
      break

    case '1-3 years':
      score += 7
      break

    case '3-5 years':
      score += 4
      break

    case 'More than 5 years':
      break
  }

  // 5. Sector risk (20 pts)
  const sectorRisk = {
    'Electronic Technology': 10,
    'Technology Services': 9,
    'Retail Trade': 7,
    'Consumer Services': 6,
    'Consumer Non-Durables': 3,
    Utilities: 2,
  }

  let weightedRisk = 0

  for (const [sector, info] of Object.entries(sectorExposure)) {
    weightedRisk +=
      (info.percentage / 100) * (sectorRisk[sector] ?? 5)
  }

  score += weightedRisk * 2

  score = Math.min(100, Math.round(score))

  let profile

  if (score < 25) profile = 'Low'
  else if (score < 50) profile = 'Moderate'
  else if (score < 75) profile = 'High'
  else profile = 'Very High'

  console.log(`Portfolio risk score: ${score}, Profile: ${profile}`)

  return {
    score,
    profile,
    reasons,
  }
}