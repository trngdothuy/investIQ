import { render, screen, fireEvent } from '@testing-library/react'
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
    answers: {},
    updateAnswers: updateAnswersMock,
  }),
}))

import Batch3 from '../routes/questionnaireBatches/batch3'

describe('Batch 3', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page', () => {
    render(<Batch3 />)

    expect(screen.getAllByText(/Risk Profile/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Imagine your portfolio drops 20% in value/i)).toBeInTheDocument()
  })

  it('disables Next button initially', () => {
    render(<Batch3 />)

    expect(
      screen.getByRole('button', {
        name: /Next/i,
      }),
    ).toBeDisabled()
  })

  it('enables Next button after answering all questions', () => {
    render(<Batch3 />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Sell everything/i,
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /Very low/i,
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /Very uncomfortable/i,
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: /protect my money/i,
      }),
    )

    expect(
      screen.getByRole('button', {
        name: /Next/i,
      }),
    ).toBeEnabled()
  })

  it('updates answers and navigates to Batch 4', () => {
    render(<Batch3 />)

    fireEvent.click(screen.getByRole('button', { name: /Sell everything/i }))
    fireEvent.click(screen.getByRole('button', { name: /Very low/i }))
    fireEvent.click(screen.getByRole('button', { name: /Very uncomfortable/i }))
    fireEvent.click(screen.getByRole('button', { name: /protect my money/i }))

    fireEvent.click(
      screen.getByRole('button', {
        name: /Next/i,
      }),
    )

    expect(updateAnswersMock).toHaveBeenCalled()

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/questionnaireBatches/batch4',
    })
  })

  it('navigates back to Batch 2', () => {
    render(<Batch3 />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Back/i,
      }),
    )

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/questionnaireBatches/batch2',
    })
  })
})
