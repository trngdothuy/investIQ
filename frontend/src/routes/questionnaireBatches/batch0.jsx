import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/questionnaireBatches/batch0')({
  component: Batch0,
})

function Batch0() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // smooth loading animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 30)

    // redirect when complete
    const timer = setTimeout(() => {
      navigate({ to: '/questionnaireBatches/batch1' })
    }, 1600)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [navigate])

  return (
    <div className="q-page flex items-center justify-center">
      <div className="q-card text-center w-full max-w-md">
        {/* TITLE */}
        <h2 className="text-xl font-bold mb-2 text-primary">Preparing your investment profile</h2>

        {/* SUBTEXT */}
        <p className="text-base-content/70">
          Just a moment while we set up your personalised questions…
        </p>

        {/* LOADING BAR */}
        <div className="mt-8 w-full h-3 rounded-full bg-base-200 overflow-hidden border border-base-300">
          <div
            className="h-full bg-primary transition-all duration-200 ease-out rounded-full shadow-sm"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {/* PERCENT TEXT */}
        <p className="text-sm text-base-content/50 mt-3">
          {progress < 100 ? `${progress}%` : 'Ready'}
        </p>
      </div>
    </div>
  )
}
