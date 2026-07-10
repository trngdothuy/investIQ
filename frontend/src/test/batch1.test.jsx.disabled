import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const navigateMock = vi.fn()
const updateAnswersMock = vi.fn()

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')

  return {
    ...actual,
    useNavigate: () => navigateMock,
    Link: ({ children, to, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

vi.mock('../context/questionnaireContext', () => ({
  useQuestionnaire: () => ({
    answers: {},
    updateAnswers: updateAnswersMock,
  }),
}))

import Batch1 from '../routes/questionnaireBatches/batch1'

describe('Batch 1', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page', () => {
    render(<Batch1 />)

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Basic Information/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByText(/What should we call you/i)).toBeInTheDocument()
  })

  it('disables Continue button initially', () => {
    render(<Batch1 />)

    expect(
      screen.getByRole('button', {
        name: /Next/i,
      }),
    ).toBeDisabled()
  })

  it('shows validation error for invalid age', () => {
    render(<Batch1 />)

    fireEvent.change(screen.getByPlaceholderText('18-99'), {
      target: { value: '10' },
    })

    expect(screen.getByText(/Please enter a valid age between 18 and 99/i)).toBeInTheDocument()
  })

  it('enables Continue button after valid input', () => {
    render(<Batch1 />)

    fireEvent.change(screen.getByPlaceholderText(/Alex/i), {
      target: { value: 'John' },
    })

    fireEvent.change(screen.getByPlaceholderText('18-99'), {
      target: { value: '25' },
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: /Student/i,
      }),
    )

    expect(
      screen.getByRole('button', {
        name: /Continue/i,
      }),
    ).toBeEnabled()
  })

  it('updates answers and navigates to Batch 2', () => {
    render(<Batch1 />)

    fireEvent.change(screen.getByPlaceholderText(/Alex/i), {
      target: { value: 'John' },
    })

    fireEvent.change(screen.getByPlaceholderText('18-99'), {
      target: { value: '25' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Student/i }))

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))

    expect(updateAnswersMock).toHaveBeenCalledWith({
      name: 'John',
      age: 25,
      situation: 'Student',
    })

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/questionnaireBatches/batch2',
    })
  })

  it('navigates back to questionnaire', () => {
    render(<Batch1 />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Back/i,
      }),
    )

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/questionnaire',
    })
  })
})
