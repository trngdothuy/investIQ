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
  const riskComparison = compareRisk(riskTolerance, portfolioRisk)

  return {
    portfolioSummary,
    sectorExposure,
    riskTolerance,
    portfolioRisk,
    riskComparison,
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
  // Change score to percentage of max score (100) from 4 to 16
  const normalizedScore = Math.round(
    ((questionnaire.riskScore -4 ) / (16 - 4)) * 100
  );
  console.log(`Risk tolerance score: ${normalizedScore}, Profile: ${questionnaire.riskProfile}`);
  
  return {
    score: normalizedScore,
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

  // 1. Largest sector exposure (40 pts)
  // Is most of the money in one sector? -> More risk.
  const largestSector = Math.max(
    ...Object.values(sectorExposure).map((s) => s.percentage),
  )

  if (largestSector > 50) {
    score += 40
    reasons.push('More than half of your portfolio is invested in one sector.')
  } else if (largestSector > 35) {
    score += 30
    reasons.push('Large concentration in a single sector.')
  } else if (largestSector > 20) {
    score += 15
  }

  // 2. Number of holdings (25 pts)
  // Is most money in one stock? -> More risk. Fewer holdings -> More risk.
  const holdings = portfolioSummary.numberOfHoldings

  if (holdings <= 5) {
    score += 25
    reasons.push('Very few holdings.')
  } else if (holdings <= 10) {
    score += 15
  } else if (holdings <= 20) {
    score += 8
  }

  // 3. Largest holding (20 pts)
  // Does one stock represent a large share of the portfolio? -> More risk.
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

  // 4. Investment horizon (15 pts)
  // Shorter investment horizon -> More risk.
  switch (questionnaire.horizon) {
    case 'Less than 1 year':
      score += 15
      reasons.push('Very short investment horizon.')
      break

    case '1-3 years':
      score += 10
      reasons.push('Moderate investment horizon.')
      break

    case '3-5 years':
      score += 5
      reasons.push('Long-term investment horizon.')
      break

    case 'More than 5 years':
      reasons.push('Very long-term investment horizon.')
      break
  }

  score = Math.min(100, Math.round(score))

  let profile

  if (score < 25) profile = 'Low'
  else if (score < 50) profile = 'Moderate'
  else if (score < 75) profile = 'High'
  else profile = 'Very High'

  console.log(`Portfolio risk score: ${score}, Profile: ${profile}`)
  console.log('Reasons for risk score:')
  reasons.forEach((reason) => console.log(`- ${reason}`))

  return {
    score,
    profile,
    reasons,
  }
}

export function compareRisk(riskTolerance, portfolioRisk) {
  const difference = Math.abs(
    riskTolerance.score - portfolioRisk.score
  );

  let status;

  if (difference <= 15) status = "Excellent";
  else if (difference <= 30) status = "Good";
  else if (difference <= 50) status = "Fair";
  else status = "Poor";

  let direction = "Well aligned";

  if (riskTolerance.score < portfolioRisk.score) {
    direction = "Portfolio is riskier than your tolerance";
  } else if (riskTolerance.score > portfolioRisk.score) {
    direction = "Portfolio is more conservative than your tolerance";
  } else {
    direction = "Portfolio is aligned with your tolerance";
  }

  console.log(`Risk comparison: Difference = ${difference}, Status = ${status}, Direction = ${direction}`);

  return {
    difference,
    status,
    direction,
  };
}