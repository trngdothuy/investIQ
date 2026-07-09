export function analysePortfolio(questionnaire) {
  const portfolio = questionnaire.portfolio ?? []
  const portfolioSummary = calculateTotalInvestment(portfolio)
  const totalPortfolioValue = calculateTotalPortfolioValue(portfolio)
  const sectorExposure = calculateSectorExposure(portfolio)
  const riskTolerance = calculateRiskTolerance(questionnaire)
  const portfolioRisk = calculatePortfolioRisk(portfolioSummary, sectorExposure, questionnaire)
  const riskComparison = compareRisk(riskTolerance, portfolioRisk)


  return {
    portfolioSummary,
    totalPortfolioValue,
    sectorExposure,
    riskTolerance,
    portfolioRisk,
    riskComparison,

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










// import { US_STOCKS } from '../data/stocks.js'

// function enrichHoldings(portfolio, stockData = US_STOCKS) {
//   return portfolio.map((stock) => {
//     const stockInfo = stockData.find((s) => s.ticker === stock.ticker)

//     return {
//       ticker: stock.ticker,
//       name: stock.name ?? stockInfo?.name,
//       sector: stock.sector ?? stockInfo?.sector,
//       quantity: Number(stock.quantity),
//       averagePrice: Number(stock.buyPrice),
//       currentPrice: stockInfo ? stockInfo.currentPrice : Number(stock.buyPrice),
//     }
//   })
// }

// export function analysePortfolio(questionnaire) {
//   const portfolio = questionnaire.portfolio ?? []
//   const holdings = enrichHoldings(portfolio)

//   console.log('Top 3 holdings')
//   console.log(topHoldingsByValue(holdings))

//   console.log('Total portfolio value')
//   console.log(totalPortfolioValue(holdings))

//   console.log('Total invested value')
//   console.log(totalInvestedValue(holdings))

//   console.log('Number of holdings')
//   console.log(numberofHoldings(holdings))

//   const result = {
//     portfolioSummary: {
//       totalCurrentValue: totalPortfolioValue(holdings),
//       totalInvestment: totalInvestedValue(holdings),
//       numberOfHoldings: numberofHoldings(holdings),
//       holdings,
//     },
//     sectorExposure: sectorExposureBreakdown(holdings),
//     topHoldings: topHoldingsByValue(holdings),
//     diversification: diversificationScore(holdings),
//     // more metrics later...
//   }

//   console.log('Portfolio analysis:')
//   console.log(result)

//   return result
// }


// done
// const totalPortfolioValue = (holdings) => {
//   return holdings.reduce((total, holding) => {
//     return total + holding.quantity * holding.currentPrice
//   }, 0)
// }

// const totalInvestedValue = (holdings) => {
//   return holdings.reduce((total, holding) => {
//     return total + holding.quantity * holding.averagePrice
//   }, 0)
// }

// const numberofHoldings = (holdings) => {
//   return holdings.length
// }

// const topHoldingsByValue = (holdings) => {
//   let topHoldings = []

//   topHoldings = holdings
//     .sort((a, b) => b.quantity * b.currentPrice - a.quantity * a.currentPrice)
//     .slice(0, 3)

//   return topHoldings
// }

// const sectorExposureBreakdown = (holdings) => {
//   const totalHoldingValue = totalPortfolioValue(holdings)

//   const sectorExposure = holdings.reduce((accumulation, holding) => {
//     const value = holding.quantity * holding.currentPrice
//     if (!accumulation[holding.sector]) {
//       accumulation[holding.sector] = { value: 0, percentage: 0 }
//     }
//     accumulation[holding.sector].value += value
//     return accumulation
//   }, {})

//   for (const sector in sectorExposure) {
//     sectorExposure[sector].percentage = (sectorExposure[sector].value / totalHoldingValue) * 100
//   }

//   return sectorExposure
// }

// const diversificationScore = (holdings) => {
//   const Holdings = numberofHoldings(holdings)
//   let scoreOfHoldings
//   let concentrationPercentage
//   let concentrationScore 

//   let sectorValues = {
//     RetailTrade: 0,
//     ConsumerServices: 0,
//     ElectronicTechnology: 0,
//     EnergyMinerals: 0,
//     ProducerManufacturing: 0,
//     Utilities: 0,
//     ConsumerNonDurables: 0,
//     ConsumerDurables: 0,
//     TechnologyServices: 0,
//   }

//   //score for number of holdings
//   const scoreForHoldings = [
//     { min: 1, max: 5, score: 20 },
//     { min: 6, max: 10, score: 50 },
//     { min: 11, max: 20, score: 80 },
//     { min: 21, max: Infinity, score: 100 },
//   ]

//   for (const row of scoreForHoldings) {
//     if (Holdings >= row.min && Holdings <= row.max) {
//       scoreOfHoldings = row.score
//     }
//   }

//   //score for concentration
//   const topHolding = topHoldingsByValue(holdings)[0]
//   const totalValue = totalPortfolioValue(holdings)
//   const topHoldingValue = topHolding.quantity * topHolding.currentPrice
//   concentrationPercentage = (topHoldingValue / totalValue) * 100

//   const tableForConcentration = [
//     { min: 0, max: 10, score: 100 },
//     { min: 11, max: 20, score: 80 },
//     { min: 21, max: 30, score: 60 },
//     { min: 31, max: 40, score: 40 },
//     { min: 41, max: Infinity, score: 20 },
//   ]

//   for (const row of tableForConcentration) {
//     if (concentrationPercentage >= row.min && concentrationPercentage <= row.max) {
//       concentrationScore = row.score
//     }
//   }

//   //score for sector diversification
//   for (const holding of holdings) {
//     switch (holding.sector) {
//       case 'Retail Trade':
//         sectorValues.RetailTrade += holding.quantity * holding.currentPrice
//         break
//       case 'Consumer Services':
//         sectorValues.ConsumerServices += holding.quantity * holding.currentPrice
//         break
//       case 'Electronic Technology':
//         sectorValues.ElectronicTechnology += holding.quantity * holding.currentPrice
//         break
//       case 'Energy Minerals':
//         sectorValues.EnergyMinerals += holding.quantity * holding.currentPrice
//         break
//       case 'Producer Manufacturing':
//         sectorValues.ProducerManufacturing += holding.quantity * holding.currentPrice
//         break
//       case 'Utilities':
//         sectorValues.Utilities += holding.quantity * holding.currentPrice
//         break
//       case 'Consumer Non-Durables':
//         sectorValues.ConsumerNonDurables += holding.quantity * holding.currentPrice
//         break
//       case 'Consumer Durables':
//         sectorValues.ConsumerDurables += holding.quantity * holding.currentPrice
//         break
//       case 'Technology Services':
//         sectorValues.TechnologyServices += holding.quantity * holding.currentPrice
//         break
//     }
//   }

//   const largestSectorValue = Math.max(...Object.values(sectorValues))
//   const largestSectorPercentage = (largestSectorValue / totalValue) * 100
//   const tableForSectorDiversification = [
//     { min: 0, max: 25, score: 100 },
//     { min: 26, max: 40, score: 80 },
//     { min: 41, max: 50, score: 60 },
//     { min: 51, max: 60, score: 40 },
//     { min: 61, max: Infinity, score: 20 },
//   ]

//   let sectorDiversificationScore;

//   for (const row of tableForSectorDiversification) {
//     if (largestSectorPercentage >= row.min && largestSectorPercentage < row.max) {
//       sectorDiversificationScore = row.score
//       break
//     }
//   }

//   //Calculating the overall and interpretation
//   let weightScore = {
//     holdings: scoreOfHoldings * 0.25, 
//     concentration: concentrationScore * 0.4, 
//     sectorDiversification: sectorDiversificationScore * 0.35,
//   }

//   //Interpretation Table for weightScore
//   const weightScoreTable = [
//     { min: 0, max: 20, interpretation: 'Very Concentrated' },
//     { min: 21, max: 40, interpretation: 'Poor Diversification' },
//     { min: 41, max: 60, interpretation: 'Moderate Diversification' },
//     { min: 61, max: 80, interpretation: 'Good Diversification' },
//     { min: 81, max: 100, interpretation: 'Excellent Diversification' },
//   ]

//   const finalScore = weightScore.holdings + weightScore.concentration + weightScore.sectorDiversification

//   for (const row of weightScoreTable) {
//     let summaryInterpretation = '';
//     if (finalScore >= row.min && finalScore <= row.max) {
//       summaryInterpretation = `Your portfolio has a ${row.interpretation}`
//       return { interpretation: summaryInterpretation, finalScore } //Final return for diversification
//     }
//   }
// }