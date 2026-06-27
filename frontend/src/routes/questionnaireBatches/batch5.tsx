import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { useQuestionnaire } from '../../context/questionnaireContext'

export const Route = createFileRoute('/questionnaireBatches/batch5')({
  component: Batch5,
})

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY

interface StockSuggestion {
  symbol: string
  description: string
  type: string
}

interface PortfolioRow {
  id: string
  symbol: string
  name: string
  type: string
  quantity: string
  pricePerShare: number | null
}

function Batch5() {
  const navigate = useNavigate()
  const { answers, updateAnswers } = useQuestionnaire()

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([])
  const [searching, setSearching] = useState(false)
  const [rows, setRows] = useState<PortfolioRow[]>(answers.portfolio ?? [])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_KEY}`,
        )
        const data = await res.json()
        const filtered = (data.result ?? [])
          .filter((r: StockSuggestion) => r.type === 'Common Stock')
          .slice(0, 6)
        setSuggestions(filtered)
      } catch {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 400)
  }, [query])

  async function addStock(stock: StockSuggestion) {
    // Prevent duplicates
    if (rows.find((r) => r.symbol === stock.symbol)) {
      setQuery('')
      setSuggestions([])
      return
    }

    let price: number | null = null
    try {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${FINNHUB_KEY}`,
      )
      const data = await res.json()
      price = data.c ?? null
    } catch {
      price = null
    }

    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        symbol: stock.symbol,
        name: stock.description,
        type: 'Stock',
        quantity: '',
        pricePerShare: price,
      },
    ])
    setQuery('')
    setSuggestions([])
  }

  function updateQuantity(id: string, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, quantity: value } : r)))
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  function handleAddAnother() {
    searchRef.current?.focus()
    searchRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleFinish() {
    updateAnswers({ portfolio: rows })
    navigate({ to: '/' }) // update this when insights page is ready
  }

  const canProceed =
    rows.length > 0 && rows.every((r) => r.quantity !== '' && Number(r.quantity) > 0)

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <p className="text-sm text-base-content/50 mb-1">Your Portfolio</p>
      <p className="text-sm text-base-content/50 mb-4">Step 5 of 5</p>
      <progress className="progress progress-primary w-full mb-8" value={100} max={100} />

      <h2 className="text-xl font-bold mb-2">What investments do you currently hold?</h2>
      <p className="text-sm text-base-content/60 mb-6">
        Search for each stock and enter the quantity you hold. Market value is calculated
        automatically.
      </p>

      {/* Search box */}
      <div className="relative mb-8">
        <label className="block font-medium mb-2">Search for a stock</label>
        <input
          ref={searchRef}
          type="text"
          className="input input-bordered border-2 w-full"
          placeholder="e.g. Apple, AAPL, Tesla..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {(searching || suggestions.length > 0) && (
          <ul className="absolute z-10 w-full bg-base-100 border-2 border-base-300 rounded-lg mt-1 shadow-lg">
            {searching && <li className="px-4 py-3 text-sm text-base-content/50">Searching...</li>}
            {suggestions.map((s) => (
              <li key={s.symbol}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-base-200 transition-colors"
                  onClick={() => addStock(s)}
                >
                  <span className="font-semibold">{s.symbol}</span>
                  <span className="text-sm text-base-content/60 ml-2">{s.description}</span>
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
            <thead className="bg-base-200 text-sm text-base-content/60">
              <tr>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Market Value (USD)</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const qty = Number(row.quantity)
                const marketValue =
                  row.pricePerShare !== null && qty > 0
                    ? `$${(row.pricePerShare * qty).toFixed(2)}`
                    : '—'

                return (
                  <tr key={row.id} className="border-t border-base-200">
                    <td>
                      <p className="font-semibold text-sm">{row.name}</p>
                      <p className="text-xs text-base-content/50">{row.symbol}</p>
                    </td>
                    <td className="text-sm">{row.type}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        className="input input-bordered input-sm w-24"
                        placeholder="e.g. 10"
                        value={row.quantity}
                        onChange={(e) => updateQuantity(row.id, e.target.value)}
                      />
                    </td>
                    <td className="text-sm font-medium">{marketValue}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => removeRow(row.id)}
                        aria-label="Remove"
                      >
                        🗑
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
