import { test, expect, vi, beforeEach } from 'vitest'
import { BOYCOTT_LIST } from '../data/boycottList.js'

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

const stockA = { ticker: 'AAA', name: 'Alpha Inc', quantity: 10, buyPrice: 10, currentPrice: 15, sector: 'Tech', industry: 'Software' }
const stockB = { ticker: 'BBB', name: 'Beta Inc', quantity: 5, buyPrice: 20, currentPrice: 18, sector: 'Finance', industry: 'Banking' }
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
