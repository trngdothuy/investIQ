import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')

  return {
    ...actual,
    Link: ({ children, to, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

import HomePage from '../routes/index'

describe('Landing Page', () => {
  const renderPage = () => render(<HomePage />)

  it('renders the InvestIQ title', () => {
    renderPage()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'InvestIQ',
      }),
    ).toBeInTheDocument()
  })

  it('renders the main hero heading', () => {
    renderPage()

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Invest with/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders the Get Started link', () => {
    renderPage()

    expect(
      screen.getByRole('link', {
        name: /Get Started/i,
      }),
    ).toBeInTheDocument()
  })

  it('navigates to the questionnaire when Get Started is clicked', () => {
    renderPage()

    const link = screen.getByRole('link', {
      name: /Get Started/i,
    })

    expect(link).toHaveAttribute('href', '/questionnaire')
  })

  it('renders the three feature cards', () => {
    renderPage()

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Portfolio Analysis',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Learn While Investing',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'Environmental and Social Impacts',
      }),
    ).toBeInTheDocument()
  })

  it('renders the Why InvestIQ section', () => {
    renderPage()

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Why InvestIQ/i,
      }),
    ).toBeInTheDocument()
  })

  it('renders the footer copyright', () => {
    renderPage()

    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })
})
