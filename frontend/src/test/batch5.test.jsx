import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const navigateMock = vi.fn()
const updateAnswersMock = vi.fn()

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')

  return {
    ...actual,
    useNavigate: () => navigateMock,
    Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  }
})

vi.mock('../context/questionnaireContext', () => ({
  useQuestionnaire: () => ({
    answers: {
      portfolio: [
        {
          id: '1',
          ticker: 'AAPL',
          name: 'Apple',
          quantity: '10',
          buyPrice: '150',
        },
      ],
    },
    updateAnswers: updateAnswersMock,
  }),
}))

vi.mock('../data/stocks', () => ({
  US_STOCKS: [
    {
      ticker: 'AAPL',
      name: 'Apple',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      currentPrice: 200,
    },
    {
      ticker: 'MSFT',
      name: 'Microsoft',
      sector: 'Technology',
      industry: 'Software',
      currentPrice: 450,
    },
    {
      ticker: 'NVDA',
      name: 'NVIDIA',
      sector: 'Technology',
      industry: 'Semiconductors',
      currentPrice: 120,
    },
    {
      ticker: 'AMZN',
      name: 'Amazon',
      sector: 'Consumer',
      industry: 'E-Commerce',
      currentPrice: 180,
    },
    {
      ticker: 'RNW',
      name: 'ReNew Energy Global',
      sector: 'Energy',
      industry: 'Renewables',
      currentPrice: 8,
    },
    {
      ticker: 'KO',
      name: 'Coca-Cola',
      sector: 'Consumer',
      industry: 'Beverages',
      currentPrice: 70,
    },
    {
      ticker: 'SBUX',
      name: 'Starbucks',
      sector: 'Consumer',
      industry: 'Restaurants',
      currentPrice: 95,
    },
  ],
}))

import Batch5 from '../routes/questionnaireBatches/batch5'

describe('Batch 5', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        overallScore: 82,
      }),
    })

    localStorage.clear()
  })

  it('renders the page', () => {
    render(<Batch5 />)

    expect(screen.getAllByText(/Portfolio/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/What investments do you currently hold/i)).toBeInTheDocument()
  })

  it('renders the stock search input', () => {
    render(<Batch5 />)

    expect(screen.getByPlaceholderText(/Search by company or ticker/i)).toBeInTheDocument()
  })

  it('renders the View Insights button', () => {
    render(<Batch5 />)

    expect(
      screen.getByRole('button', {
        name: /View Insights/i,
      }),
    ).toBeInTheDocument()
  })

  it('submits the questionnaire and navigates to dashboard', async () => {
    render(<Batch5 />)

    const button = screen.getByRole('button', {
      name: /View Insights/i,
    })

    expect(button).toBeEnabled()

    fireEvent.click(button)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(updateAnswersMock).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: '/dashboard',
      })
    })
  })

  it('navigates back to Batch 4', () => {
    render(<Batch5 />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Back/i,
      }),
    )

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/questionnaireBatches/batch4',
    })
  })
})
