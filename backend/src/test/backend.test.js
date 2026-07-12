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
