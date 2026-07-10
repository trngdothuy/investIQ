const stepsMap = ['Basic Information', 'Goals', 'Risk', 'Values', 'Portfolio']

export default function ProgressHeader({ title, step, totalSteps }) {
  const progress = (step / totalSteps) * 100

  return (
    <div className="q-progress-header">
      {/* Breadcrumb */}
      <div className="q-breadcrumbs flex flex-wrap gap-2 text-sm mb-4">
        {stepsMap.map((label, index) => {
          const stepIndex = index + 1
          const isActive = stepIndex === step
          const isDone = stepIndex < step

          return (
            <span
              key={label}
              className={`
              q-breadcrumb-item
              ${isDone ? 'done' : ''}
              ${isActive ? 'active' : ''}
              ${!isDone && !isActive ? 'inactive' : ''}
            `}
            >
              {label}

              {stepIndex !== stepsMap.length && (
                <span className="mx-2 text-base-content/30">→</span>
              )}
            </span>
          )
        })}
      </div>

      {/* Title row */}
      <div className="q-progress-title-row">
        <h2 className="q-progress-title">{title}</h2>

        <span className="q-progress-step">
          Step {step} of {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <progress className="progress progress-primary w-full mt-3" value={progress} max={100} />
    </div>
  )
}
