export default function QuestionBlock({ title, helper, state = '', children }) {
  return (
    <div className={`q-question q-question-${state}`}>
      <div className="q-question-header">
        <label className="q-label">{title}</label>

        {helper && <p className="q-helper">{helper}</p>}
      </div>

      <div className="q-question-body">{children}</div>
    </div>
  )
}
