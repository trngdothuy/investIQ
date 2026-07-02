export function analysePortfolio(questionnaire) {
  const portfolio = questionnaire.portfolio ?? []

  return {
    portfolioSummary: calculateTotalInvestment(portfolio),
    sectorExposure: calculateSectorExposure(portfolio),
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
