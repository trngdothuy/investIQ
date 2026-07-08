// ASSUMPTION: stocks.js is in the same folder. Adjust the import path if it lives elsewhere.
import { US_STOCKS } from '../data/stocks.js'

/**
 * Enriches raw portfolio entries (ticker, name, sector, quantity, buyPrice)
 * with `currentPrice` looked up from US_STOCKS by ticker, and renames
 * buyPrice -> averagePrice to match the functions below.
 */
function enrichHoldings(portfolio, stockData = US_STOCKS) {
  return portfolio.map((stock) => {
    const stockInfo = stockData.find((s) => s.ticker === stock.ticker)

    return {
      ticker: stock.ticker,
      name: stock.name ?? stockInfo?.name,
      sector: stock.sector ?? stockInfo?.sector,
      quantity: Number(stock.quantity),
      averagePrice: Number(stock.buyPrice),
      currentPrice: stockInfo ? stockInfo.currentPrice : Number(stock.buyPrice),
    }
  })
}

export function analysePortfolio(questionnaire) {
  const portfolio = questionnaire.portfolio ?? []
  const holdings = enrichHoldings(portfolio)

  const result = {
    portfolioSummary: {
      totalCurrentValue: totalPortfolioValue(holdings),
      totalInvestment: totalInvestedValue(holdings),
      numberOfHoldings: numberofHoldings(holdings),
      holdings,
    },
    sectorExposure: sectorExposureBreakdown(holdings),
    topHoldings: topHoldingsByValue(holdings),
    diversification: diversificationScore(holdings),
    // more metrics later...
  }

  console.log('Portfolio analysis:')
  console.log(result)

  return result
}



const totalPortfolioValue = (holdings) => {
  return holdings.reduce((total, holding) => {
    return total + holding.quantity * holding.currentPrice
  }, 0)
}

const totalInvestedValue = (holdings) => {
  return holdings.reduce((total, holding) => {
    return total + holding.quantity * holding.averagePrice
  }, 0)
}

const numberofHoldings = (holdings) => {
  return holdings.length
}

const topHoldingsByValue = (holdings) => {
  let topHoldings = []

  topHoldings = holdings
    .sort((a, b) => b.quantity * b.currentPrice - a.quantity * a.currentPrice)
    .slice(0, 3)

  return topHoldings
}

const sectorExposureBreakdown = (holdings) => {
  const totalHoldingValue = totalPortfolioValue(holdings)

  const sectorExposure = holdings.reduce((accumulation, holding) => {
    const value = holding.quantity * holding.currentPrice
    if (!accumulation[holding.sector]) {
      accumulation[holding.sector] = { value: 0, percentage: 0 }
    }
    accumulation[holding.sector].value += value
    return accumulation
  }, {})

  for (const sector in sectorExposure) {
    sectorExposure[sector].percentage = (sectorExposure[sector].value / totalHoldingValue) * 100
  }

  return sectorExposure
}

const diversificationScore = (holdings) => {
  const Holdings = numberofHoldings(holdings)
  let scoreOfHoldings //in for the final
  let concentrationPercentage
  let concentrationScore //in for the final

  let sectorValues = {
    RetailTrade: 0,
    ConsumerServices: 0,
    ElectronicTechnology: 0,
    EnergyMinerals: 0,
    ProducerManufacturing: 0,
    Utilities: 0,
    ConsumerNonDurables: 0,
    ConsumerDurables: 0,
    TechnologyServices: 0,
  }

  //score for number of holdings
  const scoreForHoldings = [
    { min: 1, max: 5, score: 20 },
    { min: 6, max: 10, score: 50 },
    { min: 11, max: 20, score: 80 },
    { min: 21, max: Infinity, score: 100 },
  ]

  for (const row of scoreForHoldings) {
    if (Holdings >= row.min && Holdings <= row.max) {
      scoreOfHoldings = row.score
    }
  }

  //score for concentration
  const topHolding = topHoldingsByValue(holdings)[0]
  const totalValue = totalPortfolioValue(holdings)
  const topHoldingValue = topHolding.quantity * topHolding.currentPrice
  concentrationPercentage = (topHoldingValue / totalValue) * 100

  const tableForConcentration = [
    { min: 0, max: 10, score: 100 },
    { min: 11, max: 20, score: 80 },
    { min: 21, max: 30, score: 60 },
    { min: 31, max: 40, score: 40 },
    { min: 41, max: Infinity, score: 20 },
  ]

  for (const row of tableForConcentration) {
    if (concentrationPercentage >= row.min && concentrationPercentage <= row.max) {
      concentrationScore = row.score
    }
  }

  //score for sector diversification
  for (const holding of holdings) {
    switch (holding.sector) {
      case 'Retail Trade':
        sectorValues.RetailTrade += holding.quantity * holding.currentPrice
        break
      case 'Consumer Services':
        sectorValues.ConsumerServices += holding.quantity * holding.currentPrice
        break
      case 'Electronic Technology':
        sectorValues.ElectronicTechnology += holding.quantity * holding.currentPrice
        break
      case 'Energy Minerals':
        sectorValues.EnergyMinerals += holding.quantity * holding.currentPrice
        break
      case 'Producer Manufacturing':
        sectorValues.ProducerManufacturing += holding.quantity * holding.currentPrice
        break
      case 'Utilities':
        sectorValues.Utilities += holding.quantity * holding.currentPrice
        break
      case 'Consumer Non-Durables':
        sectorValues.ConsumerNonDurables += holding.quantity * holding.currentPrice
        break
      case 'Consumer Durables':
        sectorValues.ConsumerDurables += holding.quantity * holding.currentPrice
        break
      case 'Technology Services':
        sectorValues.TechnologyServices += holding.quantity * holding.currentPrice
        break
    }
  }

  const largestSectorValue = Math.max(...Object.values(sectorValues))

  const largestSectorPercentage = (largestSectorValue / totalValue) * 100

  //score lookup, find lookup in the scoretable.
  const tableForSectorDiversification = [
    { min: 0, max: 25, score: 100 },
    { min: 26, max: 40, score: 80 },
    { min: 41, max: 50, score: 60 },
    { min: 51, max: 60, score: 40 },
    { min: 61, max: Infinity, score: 20 },
  ]

  let sectorDiversificationScore; // in for the final

  for (const row of tableForSectorDiversification) {
    if (largestSectorPercentage >= row.min && largestSectorPercentage < row.max) {
      sectorDiversificationScore = row.score
      break
    }
  }

  //Calculating the overall and interpretation
  let weightScore = {
    holdings: scoreOfHoldings * 0.25, 
    concentration: concentrationScore * 0.4, 
    sectorDiversification: sectorDiversificationScore * 0.35,
  }

  //Interpretation Table for weightScore
  const weightScoreTable = [
    { min: 0, max: 20, interpretation: 'Very Concentrated' },
    { min: 21, max: 40, interpretation: 'Poor Diversification' },
    { min: 41, max: 60, interpretation: 'Moderate Diversification' },
    { min: 61, max: 80, interpretation: 'Good Diversification' },
    { min: 81, max: 100, interpretation: 'Excellent Diversification' },
  ]

  const finalScore = weightScore.holdings + weightScore.concentration + weightScore.sectorDiversification

  for (const row of weightScoreTable) {
    let summaryInterpretation = '';
    if (finalScore >= row.min && finalScore <= row.max) {
      summaryInterpretation = `Your portfolio has a ${row.interpretation}`
      return { interpretation: summaryInterpretation, finalScore }
    }
  }
}