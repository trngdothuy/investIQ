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

export default function Batch5() {
  const navigate = useNavigate()
  const { answers, updateAnswers } = useQuestionnaire()

  const [query, setQuery] = useState('')

  const [selectedStock, setSelectedStock] = useState(null)

  const [newHolding, setNewHolding] = useState({
    quantity: '',
    buyPrice: '',
  })

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
  ].map((holding) => {
    const stock = US_STOCKS.find((s) => s.ticker === holding.ticker)

    return {
      id: crypto.randomUUID(),
      ...stock,
      quantity: holding.quantity,
      buyPrice: holding.buyPrice,
    }
  })

  const [rows, setRows] = useState(answers.portfolio ?? defaultPortfolio)

  const suggestions =
    query.trim().length >= 1
      ? US_STOCKS.filter(
          (s) =>
            s.ticker.toLowerCase().includes(query.toLowerCase()) ||
            s.name.toLowerCase().includes(query.toLowerCase()),
        ).slice(0, 6)
      : []

  function addStock(stock) {
    setSelectedStock(stock)

    const existingHolding = rows.find((row) => row.ticker === stock.ticker)

    setNewHolding({
      quantity: existingHolding?.quantity || '',
      buyPrice: existingHolding?.buyPrice || '',
    })

    setQuery('')
  }

  function updateQuantity(id, value) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, quantity: value } : r)))
  }

  function updateBuyPrice(id, value) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, buyPrice: value } : r)))
  }

  function removeRow(id) {
    const confirmed = window.confirm(
      'Are you sure you want to remove this stock from your portfolio?',
    )

    if (!confirmed) return

    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  function handleAddHolding() {
    if (!selectedStock || !newHolding.quantity || !newHolding.buyPrice) {
      return
    }

    setRows((prev) => {
      const existing = prev.find((row) => row.ticker === selectedStock.ticker)

      if (existing) {
        return prev.map((row) =>
          row.ticker === selectedStock.ticker
            ? {
                ...row,
                quantity: newHolding.quantity,
                buyPrice: newHolding.buyPrice,
              }
            : row,
        )
      }

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          ticker: selectedStock.ticker,
          name: selectedStock.name,
          sector: selectedStock.sector,
          industry: selectedStock.industry,
          currentPrice: selectedStock.currentPrice,
          quantity: newHolding.quantity,
          buyPrice: newHolding.buyPrice,
        },
      ]
    })

    setSelectedStock(null)

    setNewHolding({
      quantity: '',
      buyPrice: '',
    })

    setQuery('')
  }

  const canProceed =
    rows.length > 0 && rows.every((r) => Number(r.quantity) > 0 && Number(r.buyPrice) > 0)

  async function handleFinish() {
    const questionnaire = {
      ...answers,
      portfolio: rows,
    }

    try {
      const response = await fetch('http://localhost:3000/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaire),
      })

      const analysis = await response.json()

      const completeData = {
        ...questionnaire,
        analysis,
        selectedStock,
        questionnaireCompleted: true,
        lastCompletedBatch: 5,
      }

      localStorage.setItem('questionnaire', JSON.stringify(completeData))

      console.log('Saved:', completeData)

      updateAnswers(completeData)

      navigate({ to: '/dashboard' })
    } catch (err) {
      console.error(err)
      alert('Something went wrong while saving your questionnaire.')
    }
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
        completed={rows.length > 0}
      />

      {/* SEARCH */}
      <QuestionBlock title="Search stocks">
        <div className="flex flex-col gap-2">
          <input
            id="stock-search"
            type="text"
            className="input input-bordered w-full"
            placeholder=" 🔍 Search by company or ticker (e.g. Apple, AAPL)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {suggestions.length > 0 && (
            <ul className="w-full mt-1 bg-white border border-green-100 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
              {suggestions.map((s) => (
                <li key={s.ticker}>
                  <button
                    type="button"
                    onClick={() => addStock(s)}
                    aria-label={`Select stock ${s.ticker} (${s.name})`}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-green-50 transition-colors duration-150 border-b last:border-b-0 border-base-200"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-base-content">{s.ticker}</span>

                      <span className="text-sm text-base-content/60">{s.name}</span>
                      {rows.some((row) => row.ticker === s.ticker) && (
                        <span className="text-xs text-success font-medium">
                          Already in portfolio
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedStock && (
          <div className="selected-stock-card mt-6">
            <div className="selected-stock-header">
              <h3>{selectedStock.name}</h3>
              <span>{selectedStock.ticker}</span>
            </div>

            <div className="selected-stock-details">
              <p>
                <strong>Current Price:</strong> ${selectedStock.currentPrice}
              </p>

              <p>
                <strong>Sector:</strong> {selectedStock.sector}
              </p>

              <p>
                <strong>Industry:</strong> {selectedStock.industry}
              </p>
            </div>

            <div className="selected-stock-form">
              <div>
                <label htmlFor="new-quantity">Quantity</label>

                <input
                  id="new-quantity"
                  className="input input-bordered w-full"
                  type="number"
                  min="1"
                  value={newHolding.quantity}
                  onChange={(e) =>
                    setNewHolding({
                      ...newHolding,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label htmlFor="new-buy-price">Buy Price</label>

                <input
                  id="new-buy-price"
                  className="input input-bordered w-full"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newHolding.buyPrice}
                  onChange={(e) =>
                    setNewHolding({
                      ...newHolding,
                      buyPrice: e.target.value,
                    })
                  }
                />
              </div>

              <button type="button" className="btn btn-primary w-full" onClick={handleAddHolding}>
                {rows.some((row) => row.ticker === selectedStock.ticker)
                  ? 'Update Holding'
                  : 'Add to Portfolio'}
              </button>
            </div>
          </div>
        )}
      </QuestionBlock>

      {/* TABLE */}
      <QuestionBlock title="Your holdings">
        <div className="desktop-holdings overflow-x-auto">
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

                    <td className="text-center" aria-label="Buy price input">
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

                    <td className="text-center" aria-label="Remove option">
                      <button className="remove-btn" onClick={() => removeRow(row.id)}>
                        Remove 🗑️
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile holdings */}
        <div className="mobile-holdings">
          {rows.map((row) => {
            const qty = Number(row.quantity)
            const price = Number(row.buyPrice)
            const value = qty && price ? `$${(qty * price).toFixed(2)}` : '—'

            return (
              <div key={row.id} className="holding-card">
                <div className="holding-card-header">
                  <div>
                    <div className="holding-name">{row.name}</div>
                    <div className="holding-ticker">{row.ticker}</div>
                  </div>
                </div>

                <div className="holding-grid">
                  <div className="holding-field">
                    <label htmlFor={`quantity-${row.id}`}>Quantity</label>

                    <input
                      id={`quantity-${row.id}`}
                      className="input input-bordered input-sm"
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => updateQuantity(row.id, e.target.value)}
                    />
                  </div>

                  <div className="holding-field">
                    <label htmlFor={`buy-price-${row.id}`}>Buy Price</label>

                    <input
                      id={`buy-price-${row.id}`}
                      className="input input-bordered input-sm"
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.buyPrice}
                      onChange={(e) => updateBuyPrice(row.id, e.target.value)}
                    />
                  </div>
                </div>

                <div className="holding-value">
                  <span>Portfolio Value</span>
                  <strong>{value}</strong>
                </div>

                <button
                  type="button"
                  className="holding-remove-btn"
                  onClick={() => removeRow(row.id)}
                >
                  🗑 Remove
                </button>
              </div>
            )
          })}
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
