// import { render, screen } from '@testing-library/react'
// import { describe, it, expect, vi, beforeEach } from 'vitest'

// import Dashboard from '../routes/dashboard'

// /*
//  * ============================================================================
//  * Dashboard Tests (Initial Scaffold)
//  * ============================================================================
//  *
//  * These tests are based on the current mock implementation of the Dashboard.
//  *
//  * The Dashboard is still under active development and currently renders
//  * hardcoded portfolio data. Backend integration, portfolio analysis,
//  * questionnaire analysis and AI suggestions are still being implemented.
//  *
//  * These tests intentionally verify the overall Dashboard structure so we
//  * already have baseline coverage that can evolve alongside the component.
//  *
//  * Future updates should replace these placeholder assertions with tests
//  * against the real Dashboard behaviour once implementation is finalized.
//  *
//  * TODO
//  * ----
//  * • Mock backend portfolio analysis.
//  * • Mock questionnaire analysis.
//  * • Verify calculated portfolio metrics.
//  * • Verify diversification calculations.
//  * • Verify sector exposure calculations.
//  * • Verify risk comparison logic.
//  * • Verify AI suggestions.
//  * • Test Refresh button behaviour.
//  * • Test charts when implemented.
//  * • Test loading/error states.
//  * ============================================================================
//  */

// const navigateMock = vi.fn()

// vi.mock('@tanstack/react-router', async () => {
//   const actual = await vi.importActual('@tanstack/react-router')

//   return {
//     ...actual,
//     useNavigate: () => navigateMock,
//     Link: ({ children, ...props }) => <a {...props}>{children}</a>,
//   }
// })

// /*
//  * Temporary questionnaire mock.
//  *
//  * This will be replaced once the Dashboard consumes the real questionnaire
//  * context and backend portfolio analysis.
//  */
// vi.mock('../context/questionnaireContext', () => ({
//   useQuestionnaire: () => ({
//     answers: {
//       portfolio: [],
//       analysis: {},
//     },
//     updateAnswers: vi.fn(),
//   }),
// }))

// describe('Dashboard', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//   })

//   it('renders the dashboard page', () => {
//     render(<Dashboard />)

//     expect(screen.getByText(/Portfolio Dashboard/i)).toBeInTheDocument()
//   })

//   it('renders all portfolio summary cards', () => {
//     render(<Dashboard />)

//     expect(screen.getByText(/Portfolio Value/i)).toBeInTheDocument()
//     expect(screen.getByText(/Total Invested/i)).toBeInTheDocument()
//     expect(screen.getByText(/Total Return/i)).toBeInTheDocument()
//     expect(screen.getByText(/Diversification Score/i)).toBeInTheDocument()
//     expect(screen.getByText(/Holdings/i)).toBeInTheDocument()
//   })

//   it('renders the Top 3 Holdings section', () => {
//     render(<Dashboard />)

//     expect(screen.getByText(/Top 3 Holdings/i)).toBeInTheDocument()
//   })

//   it('renders the Risk Tolerance section', () => {
//     render(<Dashboard />)

//     expect(screen.getByText(/Risk Tolerance/i)).toBeInTheDocument()
//   })

//   it('renders the Risk Match section', () => {
//     render(<Dashboard />)

//     expect(screen.getByText(/Risk Match/i)).toBeInTheDocument()
//   })

//   it('renders the Sector Allocation section', () => {
//     render(<Dashboard />)

//     expect(screen.getByText(/Sector Allocation/i)).toBeInTheDocument()
//   })

//   it('renders the Portfolio Risk section', () => {
//     render(<Dashboard />)

//     expect(screen.getByText(/Portfolio Risk/i)).toBeInTheDocument()
//   })

//   it('renders the Suggestions section', () => {
//     render(<Dashboard />)

//     expect(screen.getByText(/Suggestions Tab/i)).toBeInTheDocument()
//   })

//   it('renders the dashboard disclaimer', () => {
//     render(<Dashboard />)

//     expect(screen.getByText(/mock data for demonstration purposes/i)).toBeInTheDocument()
//   })

//   it('renders the Refresh Portfolio button', () => {
//     render(<Dashboard />)

//     expect(
//       screen.getByRole('button', {
//         name: /Refresh Portfolio/i,
//       }),
//     ).toBeInTheDocument()
//   })
// })

// /*
//  * ============================================================================
//  * Future Test Coverage
//  * ============================================================================
//  *
//  * Once Dashboard development is complete, add tests for:
//  *
//  * - Portfolio Value calculations
//  * - Total Invested calculations
//  * - Total Return calculations
//  * - Diversification Score calculations
//  * - Top Holdings ordering
//  * - Sector Allocation percentages
//  * - Risk Tolerance calculations
//  * - Portfolio Risk calculations
//  * - Risk Match logic
//  * - AI Suggestions generation
//  * - Refresh button functionality
//  * - Chart rendering
//  * - Backend API responses
//  * - Loading and error states
//  * ============================================================================
//  */
