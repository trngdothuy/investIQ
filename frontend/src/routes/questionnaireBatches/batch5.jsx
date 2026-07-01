import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'
import { US_STOCKS } from '../../data/stocks'

import QuestionnaireLayout from '../../components/questionnaireLayout'
import ProgressHeader from '../../components/progressHeader'
import QuestionBlock from '../../components/questionBlock'

export const Route = createFileRoute('/questionnaireBatches/batch5')({
  component: Batch5,
})

function Batch5() {
  const navigate = useNavigate()
  const { updateAnswers } = useQuestionnaire()

  const [query, setQuery] = useState('')

  const defaultPortfolio = [
    {
      id: crypto.randomUUID(),
      ticker: 'AAPL',
      name: 'Apple',
      quantity: '12',
      buyPrice: '185.50',
    },
    {
      id: crypto.randomUUID(),
      ticker: 'MSFT',
      name: 'Microsoft',
      quantity: '8',
      buyPrice: '412.80',
    },
    {
      id: crypto.randomUUID(),
      ticker: 'NVDA',
      name: 'NVIDIA',
      quantity: '15',
      buyPrice: '118.40',
    },
    {
      id: crypto.randomUUID(),
      ticker: 'AMZN',
      name: 'Amazon',
      quantity: '6',
      buyPrice: '174.30',
    },
    {
      id: crypto.randomUUID(),
      ticker: 'RNW',
      name: 'ReNew Energy Global',
      quantity: '10',
      buyPrice: '7.50',
    },
    {
      id: crypto.randomUUID(),
      ticker: 'KO',
      name: 'Coca-Cola',
      quantity: '5',
      buyPrice: '80.00',
    },
    {
      id: crypto.randomUUID(),
      ticker: 'SBUX',
      name: 'Starbucks',
      quantity: '7',
      buyPrice: '100.00',
    },
  ]

  const [rows, setRows] = useState(defaultPortfolio)

  const suggestions =
    query.trim().length >= 1
      ? US_STOCKS.filter(
          (s) =>
            !rows.find((r) => r.ticker === s.ticker) &&
            (s.ticker.toLowerCase().includes(query.toLowerCase()) ||
              s.name.toLowerCase().includes(query.toLowerCase())),
        ).slice(0, 6)
      : []

  function addStock(stock) {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ticker: stock.ticker,
        name: stock.name,
        quantity: '',
        buyPrice: '',
      },
    ])
    setQuery('')
  }

  function updateQuantity(id, value) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, quantity: value } : r)))
  }

  function updateBuyPrice(id, value) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, buyPrice: value } : r)))
  }

  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const canProceed =
    rows.length > 0 && rows.every((r) => Number(r.quantity) > 0 && Number(r.buyPrice) > 0)

  function handleFinish() {
    updateAnswers({ portfolio: rows })
    navigate({ to: '/' })
  }

  function handleBack() {
    navigate({ to: '/questionnaireBatches/batch4' })
  }

  return (
    <QuestionnaireLayout>
      <ProgressHeader title="Portfolio" step={5} totalSteps={5} />

      {/* Header */}
      <QuestionBlock
        title="13. What investments do you currently hold?"
        helper="Search for stocks and enter quantities and buy prices."
        state={rows.length > 0 ? 'completed' : ''}
      ></QuestionBlock>

      {/* SEARCH */}
      <QuestionBlock title="Search stocks">
        <div className="relative">
          <input
            id="stock-search"
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. Apple, AAPL..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-base-100 border border-base-300 rounded-lg mt-2 shadow">
              {suggestions.map((s) => (
                <li key={s.ticker}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-base-200"
                    onClick={() => addStock(s)}
                  >
                    <span className="font-semibold">{s.ticker}</span>
                    <span className="text-sm text-base-content/60 ml-2">{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </QuestionBlock>

      {/* TABLE */}
      <QuestionBlock title="Your holdings">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">Asset</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Buy Price</th>
                <th className="text-center">Value</th>
                <th className="text-center">Remove</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const qty = Number(row.quantity)
                const price = Number(row.buyPrice)
                const value = qty && price ? `$${(qty * price).toFixed(2)}` : '—'

                return (
                  <tr key={row.id}>
                    <td>
                      <div className="font-semibold">{row.name}</div>
                      <div className="text-xs opacity-60">{row.ticker}</div>
                    </td>

                    <td className="text-center">
                      <input
                        className="input input-bordered input-sm w-20 text-center"
                        type="number"
                        aria-label="Quantity"
                        min="1"
                        value={row.quantity}
                        onChange={(e) => updateQuantity(row.id, e.target.value)}
                      />
                    </td>

                    <td className="text-center">
                      <input
                        className="input input-bordered input-sm w-28 text-center"
                        type="number"
                        aria-label="Buy Price"
                        min="0"
                        step="0.01"
                        value={row.buyPrice}
                        onChange={(e) => updateBuyPrice(row.id, e.target.value)}
                      />
                    </td>

                    <td className="text-center font-semibold">{value}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => removeRow(row.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </QuestionBlock>

      {/* ACTIONS */}
      <div className="q-nav-actions mt-12 flex justify-between gap-4">
        <button type="button" className="btn btn-outline w-full" onClick={handleBack}>
          ← Back
        </button>

        <button
          type="button"
          className="btn btn-primary w-full"
          disabled={!canProceed}
          onClick={handleFinish}
        >
          View Insights →
        </button>
      </div>
    </QuestionnaireLayout>
  )
}
