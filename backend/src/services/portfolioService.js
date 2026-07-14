import { BOYCOTT_LIST } from '../data/boycottList.js'

export function analysePortfolio(questionnaire) {
  const portfolio = questionnaire.portfolio ?? []
  const portfolioSummary = calculateTotalInvestment(portfolio)
  const totalPortfolioValue = calculateTotalPortfolioValue(portfolio)
  const portfolioChange = calculatePortfolioChange(
    totalPortfolioValue,
    portfolioSummary.totalInvestment,
  )
  const topHoldings = calculateTopHoldings(portfolio, totalPortfolioValue)
  const assetAllocation = calculateAssetAllocation(portfolio, totalPortfolioValue)
  const sectorExposure = calculateSectorExposure(portfolio)
  const diversification = calculateDiversification(
    portfolio,
    portfolioSummary,
    sectorExposure,
    totalPortfolioValue,
  )
  const riskTolerance = calculateRiskTolerance(questionnaire)
  const portfolioRisk = calculatePortfolioRisk(portfolioSummary, sectorExposure, questionnaire)
  const riskComparison = compareRisk(riskTolerance, portfolioRisk)
  const environmentalImpact = analyzeEnvironmentalImpact(questionnaire)
  const socialImpact = analyzeSocialImpact(questionnaire)

  return {
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
    // more metrics later...
  }
}

export function calculateTotalInvestment(portfolio) {
  // total investment, total shares, number of holdings, and individual holdings with investment value
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

export function calculateTotalPortfolioValue(portfolio) {
  const totalPortfolioValue = portfolio.reduce((total, stock) => {
    const quantity = Number(stock.quantity)
    const currentPrice = Number(stock.currentPrice)

    return total + quantity * currentPrice
  }, 0)

  console.log('Total portfolio value:')
  console.log(totalPortfolioValue)

  return Number(totalPortfolioValue.toFixed(2))
}

export function calculatePortfolioChange(totalPortfolioValue, totalInvestment) {
  if (totalInvestment === 0) {
    return Number(0)
  }

  const change = ((totalPortfolioValue - totalInvestment) / totalInvestment) * 100

  console.log('Portfolio change:')
  console.log(change)

  return Number(change.toFixed(2))
}

export function calculateTopHoldings(portfolio, totalPortfolioValue) {
  const topHoldings = portfolio
    .map((stock) => {
      const value = Number(stock.quantity) * Number(stock.currentPrice)
      const percentage = (value / totalPortfolioValue) * 100

      return {
        ticker: stock.ticker,
        name: stock.name,
        percentage: `${percentage.toFixed(1)}%`,
      }
    })
    .toSorted((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
    .slice(0, 3)

  console.log('Top 3 holdings:')
  console.log(topHoldings)

  return topHoldings
}

export function calculateAssetAllocation(portfolio, totalPortfolioValue) {
  const assetAllocation = portfolio.map((stock) => {
    const value = Number(stock.quantity) * Number(stock.currentPrice)
    const percentage = Number(((value / totalPortfolioValue) * 100).toFixed(1))

    return {
      ticker: stock.ticker,
      percentage,
    }
  })

  console.log('Asset allocation:')
  console.log(assetAllocation)

  return assetAllocation
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

export function calculateDiversification(
  portfolio,
  portfolioSummary,
  sectorExposure,
  totalPortfolioValue,
) {
  // 1. Number of holdings (25%)
  const holdings = portfolioSummary.numberOfHoldings

  let holdingsScore = 20

  if (holdings >= 21) holdingsScore = 100
  else if (holdings >= 11) holdingsScore = 80
  else if (holdings >= 6) holdingsScore = 50

  // 2. Concentration (40%)
  const largestHoldingValue = Math.max(
    ...portfolio.map((stock) => Number(stock.quantity) * Number(stock.currentPrice)),
  )

  const concentrationPercentage = (largestHoldingValue / totalPortfolioValue) * 100

  let concentrationScore = 20

  if (concentrationPercentage <= 10) concentrationScore = 100
  else if (concentrationPercentage <= 20) concentrationScore = 80
  else if (concentrationPercentage <= 30) concentrationScore = 60
  else if (concentrationPercentage <= 40) concentrationScore = 40

  // 3. Sector diversification (35%)
  const largestSectorPercentage = Math.max(
    ...Object.values(sectorExposure).map((sector) => sector.percentage),
  )

  let sectorScore = 20

  if (largestSectorPercentage <= 25) sectorScore = 100
  else if (largestSectorPercentage <= 40) sectorScore = 80
  else if (largestSectorPercentage <= 50) sectorScore = 60
  else if (largestSectorPercentage <= 60) sectorScore = 40

  // Final weighted score
  const score = Math.round(holdingsScore * 0.25 + concentrationScore * 0.4 + sectorScore * 0.35)

  let interpretation

  if (score <= 20) interpretation = 'Very Concentrated'
  else if (score <= 40) interpretation = 'Poor Diversification'
  else if (score <= 60) interpretation = 'Moderate Diversification'
  else if (score <= 80) interpretation = 'Good Diversification'
  else interpretation = 'Excellent Diversification'

  console.log('Diversification:')
  console.log({
    score,
    interpretation,
    breakdown: {
      holdingsScore,
      concentrationScore,
      sectorScore,
    },
  })

  return {
    score,
    interpretation,
    breakdown: {
      holdingsScore,
      concentrationScore,
      sectorScore,
    },
  }
}

export function calculateRiskTolerance(questionnaire) {
  // Change score to percentage of max score (100) from 4 to 16
  const normalizedScore = Math.round(((questionnaire.riskScore - 4) / (16 - 4)) * 100)
  console.log(`Risk tolerance score: ${normalizedScore}, Profile: ${questionnaire.riskProfile}`)

  return {
    score: normalizedScore,
    profile: questionnaire.riskProfile,
  }
}

export function calculatePortfolioRisk(portfolioSummary, sectorExposure, questionnaire) {
  let score = 0
  const reasons = []

  // 1. Largest sector exposure (40 pts)
  // Is most of the money in one sector? -> More risk.
  const largestSector = Math.max(...Object.values(sectorExposure).map((s) => s.percentage))

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
  const largestInvestment = Math.max(...portfolioSummary.holdings.map((h) => h.investment))

  const largestWeight = (largestInvestment / portfolioSummary.totalInvestment) * 100

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
  const difference = Math.abs(riskTolerance.score - portfolioRisk.score)

  let status

  if (difference <= 15) status = 'Excellent'
  else if (difference <= 30) status = 'Good'
  else if (difference <= 50) status = 'Fair'
  else status = 'Poor'

  let direction = 'Well aligned'

  if (riskTolerance.score < portfolioRisk.score) {
    direction = 'Portfolio is riskier than your tolerance'
  } else if (riskTolerance.score > portfolioRisk.score) {
    direction = 'Portfolio is more conservative than your tolerance'
  } else {
    direction = 'Portfolio is aligned with your tolerance'
  }

  console.log(
    `Risk comparison: Difference = ${difference}, Status = ${status}, Direction = ${direction}`,
  )

  return {
    difference,
    status,
    direction,
  }
}

export function analyzeEnvironmentalImpact(questionnaire) {
  const portfolio = questionnaire.portfolio ?? []
  const exclusions = questionnaire.exclusions ?? []

  const positiveIndustries = ['Renewable energy', 'Clean energy']
  const negativeIndustries = ['Fossil Fuels', 'Fast fashion']

  const positiveHoldings = portfolio.filter((stock) => positiveIndustries.includes(stock.industry))

  const negativeHoldings = portfolio.filter((stock) => negativeIndustries.includes(stock.industry))

  let status
  let message

  if (negativeHoldings.length > 0) {
    status = 'Negative'

    const names = negativeHoldings.map((stock) => stock.name).join(', ')

    if (exclusions.some((e) => negativeIndustries.includes(e))) {
      message = `Your portfolio still contains ${names}, which conflicts with your preference to avoid environmentally harmful industries.`
    } else {
      message = `Your portfolio includes ${names}, which operate in industries with notable environmental concerns. Consider cleaner alternatives if sustainability is important to you.`
    }
  } else if (positiveHoldings.length > 0) {
    status = 'Positive'

    const names = positiveHoldings.map((stock) => stock.name).join(', ')

    message = `Positive impact. Your portfolio includes ${names}, supporting renewable or clean energy industries.`
  } else {
    status = 'Neutral'

    message =
      'Your portfolio has no significant exposure to either environmentally positive or environmentally harmful industries.'
  }

  console.log('Environmental impact:')
  console.log({ status, message })

  return {
    status,
    message,
  }
}

export function analyzeSocialImpact(questionnaire) {
  const portfolio = questionnaire.portfolio ?? []
  const highlights = questionnaire.highlights ?? []

  const conflicts = []

  for (const value of highlights) {
    const boycottCategory = BOYCOTT_LIST.find((item) => item.category === value)

    if (!boycottCategory) continue

    const matchedCompanies = portfolio.filter((stock) =>
      boycottCategory.companies.includes(stock.name),
    )

    if (matchedCompanies.length > 0) {
      conflicts.push({
        category: value,
        companies: matchedCompanies.map((stock) => stock.name),
      })
    }
  }

  let status
  let message

  if (conflicts.length === 0) {
    status = 'Positive'

    message = 'Your current portfolio appears to align with the social values you selected.'
  } else {
    status = 'Conflict'

    const summary = conflicts
      .map((item) => `${item.category}: ${item.companies.join(', ')}`)
      .join('; ')

    message = `Some of your investments may conflict with your selected values. ${summary}. You may wish to review these holdings.`
  }

  console.log('Social impact:')
  console.log({ status, message })

  return {
    status,
    message,
    conflicts,
  }
}
