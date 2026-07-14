import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import Dashboard from '../routes/dashboard'

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')

  return {
    ...actual,
  }
})

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.setItem(
      'questionnaire',
      JSON.stringify({
        name: 'John',
        analysis: {
          portfolioSummary: {
            totalInvestment: 10000,
            numberOfHoldings: 3,
            holdings: [
              {
                name: 'Apple',
                ticker: 'AAPL',
                sector: 'Technology',
              },
              {
                name: 'Microsoft',
                ticker: 'MSFT',
                sector: 'Technology',
              },
              {
                name: 'JPMorgan',
                ticker: 'JPM',
                sector: 'Finance',
              },
            ],
          },

          totalPortfolioValue: 12000,
          portfolioChange: 20,

          topHoldings: [
            {
              name: 'Apple',
              ticker: 'AAPL',
            },
            {
              name: 'Microsoft',
              ticker: 'MSFT',
            },
            {
              name: 'JPMorgan',
              ticker: 'JPM',
            },
          ],

          assetAllocation: [
            { ticker: 'AAPL', percentage: 40 },
            { ticker: 'MSFT', percentage: 35 },
            { ticker: 'JPM', percentage: 25 },
          ],

          sectorExposure: {
            Technology: {
              percentage: 75,
            },
            Finance: {
              percentage: 25,
            },
          },

          diversification: {
            score: 82,
            interpretation: 'good',
            breakdown: {
              holdingsScore: 80,
              concentrationScore: 85,
              sectorScore: 80,
            },
          },

          riskTolerance: {
            score: 65,
            profile: 'Moderate',
          },

          portfolioRisk: {
            score: 60,
            profile: 'Moderate',
            reasons: ['Diversified across sectors'],
          },

          riskComparison: {
            difference: 5,
            status: 'Matched',
            direction: 'Your portfolio aligns with your risk tolerance.',
          },

          environmentalImpact: {
            status: 'Positive',
            message: 'Good environmental exposure.',
          },

          socialImpact: {
            status: 'Positive',
            message: 'Good social impact.',
          },

          aiSuggestions: [
            {
              title: 'Increase diversification',
              message: 'Consider adding healthcare exposure.',
              type: 'info',
            },
          ],
        },
      }),
    )
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders the dashboard heading', () => {
    render(<Dashboard />)

    expect(screen.getByText(/Welcome John/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /Portfolio Dashboard/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders portfolio metric cards', () => {
    render(<Dashboard />)

    expect(screen.getByText(/Portfolio Value/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Invested/i)).toBeInTheDocument()
    expect(screen.getByText(/^Holdings$/i)).toBeInTheDocument()
  })

  it('renders Stock Allocation section', () => {
    render(<Dashboard />)

    expect(
      screen.getByRole('heading', {
        name: /Stock Allocation/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders Top 3 Holdings section', () => {
    render(<Dashboard />)

    expect(
      screen.getByRole('heading', {
        name: /Top 3 Holdings/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders Sector Exposure section', () => {
    render(<Dashboard />)

    expect(
      screen.getByRole('heading', {
        name: /Sector Exposure/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders Environmental and Social Impact sections', () => {
    render(<Dashboard />)

    expect(
      screen.getByRole('heading', {
        name: /Environmental Impact/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: /Social Impact/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders Diversification Score section', () => {
    render(<Dashboard />)

    expect(
      screen.getByRole('heading', {
        name: /Diversification Score/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders Risk sections', () => {
    render(<Dashboard />)

    expect(screen.getAllByText(/Risk Tolerance/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Portfolio Risk/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Risk Assessment/i).length).toBeGreaterThan(0)
  })

  it('renders Suggestions section', () => {
    render(<Dashboard />)

    expect(screen.getAllByText(/Portfolio Risk/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Increase diversification/i).length).toBeGreaterThan(0)
  })

  it('renders educational disclaimer', () => {
    render(<Dashboard />)

    expect(screen.getByText(/The results are for educational purposes only/i)).toBeInTheDocument()
  })

  it('shows message when no questionnaire data exists', () => {
    localStorage.clear()

    render(<Dashboard />)

    expect(screen.getByText(/No portfolio analysis found/i)).toBeInTheDocument()
  })
})
