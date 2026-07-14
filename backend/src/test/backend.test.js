import { test, expect, vi, beforeEach } from 'vitest'
// import { BOYCOTT_LIST } from '../data/boycottList.js'

import {
  analysePortfolio,
  calculateTotalInvestment,
  calculateTotalPortfolioValue,
  calculatePortfolioChange,
  calculateTopHoldings,
  calculateAssetAllocation,
  calculateSectorExposure,
  calculateDiversification,
  calculateRiskTolerance,
  calculatePortfolioRisk,
  compareRisk,
  analyzeEnvironmentalImpact,
  analyzeSocialImpact,
} from '../services/portfolioService.js'

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

const stockA = {
  ticker: 'AAA',
  name: 'Alpha Inc',
  quantity: 10,
  buyPrice: 10,
  currentPrice: 15,
  sector: 'Tech',
  industry: 'Software',
}
const stockB = {
  ticker: 'BBB',
  name: 'Beta Inc',
  quantity: 5,
  buyPrice: 20,
  currentPrice: 18,
  sector: 'Finance',
  industry: 'Banking',
}
const basicPortfolio = [stockA, stockB]

//TotalInvestment
test('calculate the total investment, sums investment and shares, and returns per-holding data', () => {
  const result = calculateTotalInvestment(basicPortfolio)
  expect(result.totalInvestment).toBe(200) // 10*10 + 5*20
  expect(result.totalShares).toBe(15)
  expect(result.numberOfHoldings).toBe(2)
  expect(result.holdings).toHaveLength(2)
  expect(result.holdings[0]).toEqual({
    ticker: 'AAA',
    name: 'Alpha Inc',
    quantity: 10,
    buyPrice: 10,
    investment: 100,
  })
})

test('calculate the total investment for an empty portfolio returns zeros', () => {
  const result = calculateTotalInvestment([])
  expect(result.totalInvestment).toBe(0)
  expect(result.totalShares).toBe(0)
  expect(result.numberOfHoldings).toBe(0)
  expect(result.holdings).toEqual([])
})

//Total Portfolio
test('calculate the total portfolio value, sums quantity * currentPrice across holdings', () => {
  expect(calculateTotalPortfolioValue(basicPortfolio)).toBe(240)
})

test('calculate the total portfolio value for an empty portfolio returns 0', () => {
  expect(calculateTotalPortfolioValue([])).toBe(0)
})

test('calculate the total portfolio value rounds to 2 decimal places', () => {
  const portfolio = [{ quantity: 3, currentPrice: 1.111 }]
  expect(calculateTotalPortfolioValue(portfolio)).toBe(3.33)
})

//Change
test('calculate portfolio change where it calculates positive percentage change', () => {
  expect(calculatePortfolioChange(240, 200)).toBe(20)
})

test('calculate portfolio change where it calculates negative percentage change', () => {
  expect(calculatePortfolioChange(150, 200)).toBe(-25)
})

test('calculate portfolio change where it returns 0 when totalInvestment is 0 (avoids divide-by-zero)', () => {
  expect(calculatePortfolioChange(100, 0)).toBe(0)
})

//Top Holdings
test('calculate top holdings where it returns holdings sorted by percentage descending, top 3', () => {
  const portfolio = [
    { ticker: 'A', name: 'A', quantity: 1, currentPrice: 10 },
    { ticker: 'B', name: 'B', quantity: 1, currentPrice: 50 },
    { ticker: 'C', name: 'C', quantity: 1, currentPrice: 30 },
    { ticker: 'D', name: 'D', quantity: 1, currentPrice: 10 },
  ]
  const total = 100
  const result = calculateTopHoldings(portfolio, total)
  expect(result).toHaveLength(3)
  expect(result[0]).toEqual({ ticker: 'B', name: 'B', percentage: '50.0%' })
  expect(result[1]).toEqual({ ticker: 'C', name: 'C', percentage: '30.0%' })
  expect(result[2].percentage).toBe('10.0%')
})

test('calculate top holdings where it returns fewer than 3 entries if portfolio has fewer holdings', () => {
  const portfolio = [{ ticker: 'A', name: 'A', quantity: 1, currentPrice: 10 }]
  const result = calculateTopHoldings(portfolio, 10)
  expect(result).toHaveLength(1)
})

//Asset Allocation
test('calculate asset allocation where it returns ticker and percentage of total for each stock', () => {
  const result = calculateAssetAllocation(basicPortfolio, 240)
  expect(result).toEqual([
    { ticker: 'AAA', percentage: 62.5 }, // 150/240
    { ticker: 'BBB', percentage: 37.5 }, // 90/240
  ])
})

//Sector Exposure
test('calculate sector exposure, groups value (at buyPrice) and percentage by sector', () => {
  const result = calculateSectorExposure(basicPortfolio)
  expect(result.Tech).toEqual({ total_value: 100, percentage: 50 })
  expect(result.Finance).toEqual({ total_value: 100, percentage: 50 })
})

test('calculate sector exposure, groups stocks with no sector under "Unknown"', () => {
  const portfolio = [{ quantity: 1, buyPrice: 10 }]
  const result = calculateSectorExposure(portfolio)
  expect(result.Unknown).toEqual({ total_value: 10, percentage: 100 })
})

//Diversification
test('calculate diversification where it scores a concentrated portfolio poorly', () => {
  const portfolio = [{ quantity: 1, currentPrice: 100 }]
  const summary = { numberOfHoldings: 1 }
  const sectorExposure = { Tech: { percentage: 100 } }
  const result = calculateDiversification(portfolio, summary, sectorExposure, 100)
  expect(result.score).toBeLessThanOrEqual(20)
  expect(result.interpretation).toBe('Very Concentrated')
  expect(result.breakdown).toEqual({ holdingsScore: 20, concentrationScore: 20, sectorScore: 20 })
})

test('calculate diversification where it scores a broad, balanced portfolio well', () => {
  const portfolio = Array.from({ length: 25 }, () => ({ quantity: 1, currentPrice: 4 }))
  const summary = { numberOfHoldings: 25 }
  const sectorExposure = {
    A: { percentage: 20 },
    B: { percentage: 20 },
    C: { percentage: 20 },
    D: { percentage: 20 },
    E: { percentage: 20 },
  }
  const result = calculateDiversification(portfolio, summary, sectorExposure, 100)
  expect(result.interpretation).toBe('Excellent Diversification')
  expect(result.breakdown).toEqual({
    holdingsScore: 100,
    concentrationScore: 100,
    sectorScore: 100,
  })
})

//Risk Tolerance
test('calculate risk tolerance normalizes riskScore from range [4,16] to [0,100]', () => {
  expect(calculateRiskTolerance({ riskScore: 4, riskProfile: 'Conservative' })).toEqual({
    score: 0,
    profile: 'Conservative',
  })
  expect(calculateRiskTolerance({ riskScore: 16, riskProfile: 'Aggressive' })).toEqual({
    score: 100,
    profile: 'Aggressive',
  })
  expect(calculateRiskTolerance({ riskScore: 10, riskProfile: 'Balanced' })).toEqual({
    score: 50,
    profile: 'Balanced',
  })
})

// Portfolio Risk
test('calculate portfolio risk scores low risk for a diversified, long-horizon portfolio', () => {
  const summary = {
    numberOfHoldings: 25,
    totalInvestment: 1000,
    holdings: [{ investment: 40 }, { investment: 40 }],
  }
  const sectorExposure = { A: { percentage: 15 } }
  const questionnaire = { horizon: 'More than 5 years' }
  const result = calculatePortfolioRisk(summary, sectorExposure, questionnaire)
  expect(result.profile).toBe('Low')
  expect(result.score).toBeLessThan(25)
  expect(result.reasons).toEqual(['Very long-term investment horizon.'])
})

test('calculate portfolio risk scores very high risk for a concentrated, short-horizon portfolio', () => {
  const summary = {
    numberOfHoldings: 2,
    totalInvestment: 100,
    holdings: [{ investment: 90 }, { investment: 10 }],
  }
  const sectorExposure = { Tech: { percentage: 90 } }
  const questionnaire = { horizon: 'Less than 1 year' }
  const result = calculatePortfolioRisk(summary, sectorExposure, questionnaire)
  expect(result.profile).toBe('Very High')
  expect(result.score).toBe(100)
  expect(result.reasons).toEqual(
    expect.arrayContaining([
      'More than half of your portfolio is invested in one sector.',
      'Very few holdings.',
      'One investment represents a very large share of the portfolio.',
      'Very short investment horizon.',
    ]),
  )
})

// Compare Risk
test('comparing risk reports "Excellent" and alignment when scores are equal', () => {
  const result = compareRisk({ score: 50 }, { score: 50 })
  expect(result).toEqual({
    difference: 0,
    status: 'Excellent',
    direction: 'Portfolio is aligned with your tolerance',
  })
})

test('comparing risk reports portfolio riskier than tolerance', () => {
  const result = compareRisk({ score: 20 }, { score: 80 })
  expect(result.difference).toBe(60)
  expect(result.status).toBe('Poor')
  expect(result.direction).toBe('Portfolio is riskier than your tolerance')
})

test('comparing risk reports portfolio more conservative than tolerance', () => {
  const result = compareRisk({ score: 80 }, { score: 60 })
  expect(result.direction).toBe('Portfolio is more conservative than your tolerance')
  expect(result.status).toBe('Good')
})

//Environmental Impact
test('analyze environmental impact that flags "Negative" with a conflict message when an excluded negative industry is held', () => {
  const questionnaire = {
    portfolio: [{ name: 'OilCo', industry: 'Fossil Fuels' }],
    exclusions: ['Fossil Fuels'],
  }
  const result = analyzeEnvironmentalImpact(questionnaire)
  expect(result.status).toBe('Negative')
  expect(result.message).toContain('conflicts with your preference')
  expect(result.message).toContain('OilCo')
})

test('analyze environmental impact that flags "Negative" with a suggestion message when negative industry is not excluded', () => {
  const questionnaire = {
    portfolio: [{ name: 'OilCo', industry: 'Fossil Fuels' }],
    exclusions: [],
  }
  const result = analyzeEnvironmentalImpact(questionnaire)
  expect(result.status).toBe('Negative')
  expect(result.message).toContain('Consider cleaner alternatives')
})

test('analyze environmental impact that flags "Positive" when only positive industries are held', () => {
  const questionnaire = {
    portfolio: [{ name: 'SolarCo', industry: 'Renewable energy' }],
    exclusions: [],
  }
  const result = analyzeEnvironmentalImpact(questionnaire)
  expect(result.status).toBe('Positive')
  expect(result.message).toContain('SolarCo')
})

test('analyze environmental impact that flags "Neutral" when no positive or negative industries are held', () => {
  const questionnaire = {
    portfolio: [{ name: 'RandomCo', industry: 'Retail' }],
    exclusions: [],
  }
  const result = analyzeEnvironmentalImpact(questionnaire)
  expect(result.status).toBe('Neutral')
})

test('analyze environmental impact that defaults to Neutral for an empty/undefined portfolio', () => {
  const result = analyzeEnvironmentalImpact({})
  expect(result.status).toBe('Neutral')
})

//Social Impact
test('analyze the social impact that returns "Positive" when no held companies match the selected boycott categories', () => {
  const questionnaire = {
    portfolio: [{ name: 'CleanCo' }],
    highlights: ['Animal testing'],
  }
  const result = analyzeSocialImpact(questionnaire)
  expect(result.status).toBe('Positive')
  expect(result.conflicts).toEqual([])
})

test('analyze the social impact that returns "Conflict" when a held company matches a selected boycott category', () => {
  const questionnaire = {
    portfolio: [{ name: 'Burger King' }],
    highlights: ['Animal Rights'],
  }
  const result = analyzeSocialImpact(questionnaire)
  expect(result.status).toBe('Conflict')
  expect(result.conflicts).toEqual([{ category: 'Animal Rights', companies: ['Burger King'] }])
  expect(result.message).toContain('Burger King')
})

test('analyze the social impact that ignores highlights that have no matching boycott category', () => {
  const questionnaire = {
    portfolio: [{ name: 'CosmeticCo' }],
    highlights: ['Not a real category'],
  }
  const result = analyzeSocialImpact(questionnaire)
  expect(result.status).toBe('Positive')
})

test('analyze the social impact that defaults to "Positive" for empty/undefined portfolio and highlights', () => {
  const result = analyzeSocialImpact({})
  expect(result.status).toBe('Positive')
  expect(result.conflicts).toEqual([])
})

// Overall Portfolio Analysis
test('analyze the overall portfolio that assembles all sub-metrics into one result object', () => {
  const questionnaire = {
    portfolio: basicPortfolio,
    riskScore: 10,
    riskProfile: 'Balanced',
    horizon: '3-5 years',
    exclusions: [],
    highlights: [],
  }
  const result = analysePortfolio(questionnaire)

  expect(result).toHaveProperty('portfolioSummary')
  expect(result).toHaveProperty('totalPortfolioValue', 240)
  expect(result).toHaveProperty('portfolioChange')
  expect(result).toHaveProperty('topHoldings')
  expect(result).toHaveProperty('assetAllocation')
  expect(result).toHaveProperty('sectorExposure')
  expect(result).toHaveProperty('diversification')
  expect(result).toHaveProperty('riskTolerance')
  expect(result).toHaveProperty('portfolioRisk')
  expect(result).toHaveProperty('riskComparison')
  expect(result).toHaveProperty('environmentalImpact')
  expect(result).toHaveProperty('socialImpact')
})

test('analyze the overall portfolio that handles an empty portfolio without throwing', () => {
  const questionnaire = {
    portfolio: [],
    riskScore: 4,
    riskProfile: 'Conservative',
    horizon: 'Less than 1 year',
  }
  expect(() => analysePortfolio(questionnaire)).not.toThrow()
})
