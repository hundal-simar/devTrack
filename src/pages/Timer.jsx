import { useTimer } from '../hooks/useTimer'
import { useSessions } from '../hooks/useSessions'
import { formatDuration } from '../utils/formatUtils'
import EmptyState from '../components/EmptyState'

// HH:MM:SS — for the running clock display
export const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}



const statusConfig = (seconds, isRunning) => {
  if (isRunning)    return { label: 'Running',  style: 'bg-indigo-50 text-indigo-700' }
  if (seconds > 0)  return { label: 'Paused',   style: 'bg-amber-50 text-amber-700' }
  return              { label: 'Idle',     style: 'bg-gray-100 text-gray-500' }
}

function Timer() {
  const { seconds, isRunning, startedAt, start, pause, reset, displayTime } = useTimer()
  const { sessions, todaySessions, loading, saveSession, todayTotal, weekTotal, longestSession } = useSessions()

  const handleSave = async () => {
    await saveSession(seconds, startedAt)
    reset()
  }

  const status = statusConfig(seconds, isRunning)

  return (
    <div className="flex flex-col gap-5 mx-auto max-w-2xl justify-center">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Study timer</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track every minute you put in</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">Today's total</p>
          <p className="text-xl font-semibold text-gray-800">{formatDuration(todayTotal)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">This week</p>
          <p className="text-xl font-semibold text-gray-800">{formatDuration(weekTotal)}</p>
          <p className="text-xs text-gray-400 mt-1">last 7 days</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">Longest session</p>
          <p className="text-xl font-semibold text-gray-800">{formatDuration(longestSession)}</p>
          <p className="text-xs text-gray-400 mt-1">all time</p>
        </div>
      </div>

      {/* Timer card */}
      <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col items-center gap-6">

        {/* Status badge */}
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.style}`}>
          {status.label}
        </span>

        {/* Time display */}
        <span className="text-6xl font-semibold text-gray-800 tracking-widest tabular-nums">
          {displayTime}
        </span>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Idle state — only start */}
          {seconds === 0 && !isRunning && (
            <button
              onClick={start}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Start
            </button>
          )}

          {/* Running state */}
          {isRunning && (
            <>
              <button
                onClick={pause}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Pause
              </button>
              <button
                onClick={handleSave}
                className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Save & reset
              </button>
              <button
                onClick={reset}
                className="border border-gray-200 text-gray-400 px-4 py-2.5 rounded-lg text-sm hover:border-red-200 hover:text-red-400 transition-colors"
              >
                Discard
              </button>
            </>
          )}

          {/* Paused state */}
          {seconds > 0 && !isRunning && (
            <>
              <button
                onClick={start}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Resume
              </button>
              <button
                onClick={handleSave}
                className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Save & reset
              </button>
              <button
                onClick={reset}
                className="border border-gray-200 text-gray-400 px-4 py-2.5 rounded-lg text-sm hover:border-red-200 hover:text-red-400 transition-colors"
              >
                Discard
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sessions list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">Today's sessions</span>
          <span className="text-xs text-gray-400">
            {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} · {formatDuration(todayTotal)} total
          </span>
        </div>

        {loading && (
          <p className="px-5 py-8 text-center text-sm text-gray-400">Loading sessions...</p>
        )}

        {!loading && todaySessions.length === 0 && (
          <EmptyState
            icon="⏱️"
            title="No sessions today"
            subtitle="Start the timer above to begin tracking your study time"
          />
        )}

        {!loading && todaySessions.map((session, index) => (
          <div
            key={session.id}
            className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-b-0"
          >
            {/* Session number */}
            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-medium text-indigo-600 shrink-0">
              {todaySessions.length - index}
            </div>

            {/* Session info */}
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Started{' '}
                {session.startedAt?.toDate().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDuration(session.duration)}
              </p>
            </div>

            {/* Duration badge */}
            <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full">
              {formatDuration(session.duration)}
            </span>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Timer