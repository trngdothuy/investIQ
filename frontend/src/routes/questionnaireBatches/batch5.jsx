import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'
import { US_STOCKS } from '../../data/stocks'

export const Route = createFileRoute('/questionnaireBatches/batch5')({
  component: Batch5,
})

function Batch5() {
  const navigate = useNavigate()
  const { answers: _answers, updateAnswers } = useQuestionnaire()

  const [query, setQuery] = useState('')
  const defaultPortfolio = [
  {
    id: crypto.randomUUID(),
    ticker: "AAPL",
    name: "Apple",
    quantity: "12",
    buyPrice: "185.50",
  },
  {
    id: crypto.randomUUID(),
    ticker: "MSFT",
    name: "Microsoft",
    quantity: "8",
    buyPrice: "412.80",
  },
  {
    id: crypto.randomUUID(),
    ticker: "NVDA",
    name: "NVIDIA",
    quantity: "15",
    buyPrice: "118.40",
  },
  {
    id: crypto.randomUUID(),
    ticker: "AMZN",
    name: "Amazon",
    quantity: "6",
    buyPrice: "174.30",
  },
  {
    id: crypto.randomUUID(),
    ticker: "RNW",
    name: "ReNew Energy Global",
    quantity: "10",
    buyPrice: "7.50",
  },
  {
    id: crypto.randomUUID(),
    ticker: "KO",
    name: "Coca-Cola",
    quantity: "5",
    buyPrice: "80.00",
  },
  {
    id: crypto.randomUUID(),
    ticker: "SBUX",
    name: "Starbucks",
    quantity: "7",
    buyPrice: "100.00",
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
        sector: stock.sector,
        industry: stock.industry,
        currentPrice: stock.currentPrice,
        quantity: '',
        buyPrice: '',
      },
    ])
    setQuery('')
  }

  function updateQuantity(id, value) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, quantity: value } : r)))
  }

  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  function handleAddAnother() {
    setQuery('')
    document.getElementById('stock-search')?.focus()
  }

  async function handleFinish() {
  const questionnaire = {
    ...answers,
    portfolio: rows,
  }

  try {
    console.log(questionnaire.portfolio)
    const response = await fetch(
      'http://localhost:3000/api/questionnaire',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaire),
      }
    )

    const analysis = await response.json()
    console.log('Analysis:', analysis)

    updateAnswers({
      portfolio: rows,
      analysis,
    })

    navigate({ to: '/dashboard' })
  } catch (err) {
    console.error(err)
  }
}

  function updateBuyPrice(id, value) {
  setRows((prev) =>
    prev.map((r) =>
      r.id === id
        ? { ...r, buyPrice: value }
        : r
    )
  )
}

  const canProceed =
    rows.length > 0 && rows.every((r) => Number(r.quantity) > 0 && Number(r.buyPrice) > 0)

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <p className="text-sm text-base-content/50 mb-1">Your Portfolio</p>
      <p className="text-sm text-base-content/50 mb-4">Step 5 of 5</p>
      <progress className="progress progress-primary w-full mb-8" value={100} max={100} />

      <h2 className="text-xl font-bold mb-2">What investments do you currently hold?</h2>
      <p className="text-sm text-base-content/60 mb-6">
        Search for each stock and enter the quantity you hold. Investment value is calculated
        automatically.
      </p>

      {/* Search box */}
      <div className="relative mb-8">
        <label className="block font-medium mb-2" htmlFor="stock-search">
          Search for a stock
        </label>
        <input
          id="stock-search"
          type="text"
          className="input input-bordered border-2 w-full"
          placeholder="e.g. Apple, AAPL, Tesla..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="w-full bg-base-100 border-2 border-base-300 rounded-lg mt-1 shadow-lg">
            {suggestions.map((s) => (
              <li key={s.ticker}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-base-200 transition-colors"
                  onClick={() => addStock(s)}
                >
                  <span className="font-semibold">{s.ticker}</span>
                  <span className="text-sm text-base-content/60 ml-2">{s.name}</span>
                  <span className="text-xs text-base-content/40 ml-2">— {s.industry}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Table */}
      {rows.length > 0 && (
        <div className="overflow-x-auto mb-6 border border-base-300 rounded-lg">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th className="text-center">Type</th>
                <th className="text-center">Quantity</th> 
                <th className="text-center">Buy Price (USD)</th>
                <th className="text-center">Investment Value (USD)</th>
                <th>Remove</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const qty = Number(row.quantity)
                const buyPrice = Number(row.buyPrice)
                const investmentValue =
                  qty > 0 && buyPrice > 0
                    ? `$${(qty * buyPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "—"

                return (
                  <tr key={row.id}>
                    <td>
                      <div className="font-semibold">{row.name}</div>
                      <div className="text-xs opacity-60">{row.ticker}</div>
                    </td>

                    <td className="text-center" aria-label="Stock type">
                      Stock
                    </td>

                    <td className="text-center" aria-label="Quantity input">
                      <input
                        type="number"
                        min="1"
                        className="input input-bordered input-sm w-20 text-center"
                        value={row.quantity}
                        onChange={(e) =>
                          updateQuantity(row.id, e.target.value)
                        }
                      />
                    </td>

                    <td className="text-center" aria-label="Buy price input">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="input input-bordered input-sm w-28 text-right"
                        value={row.buyPrice}
                        onChange={(e) =>
                          updateBuyPrice(row.id, e.target.value)
                        }
                      />
                    </td>

                    <td className="text-center font-semibold" aria-label="Investment value">
                      {investmentValue}
                    </td>

                    <td className="text-center" aria-label="Remove option">
                      <button
                        type="button"
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
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-4">
        <button
          type="button"
          className="btn btn-outline btn-primary w-full"
          onClick={handleAddAnother}
        >
          + Add Another Investment
        </button>
        <button className="btn btn-primary w-full" disabled={!canProceed} onClick={handleFinish}>
          View My Insights
        </button>
      </div>
    </div>
  )
}
