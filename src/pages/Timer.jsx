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
    <div className="flex flex-col gap-4 sm:gap-5 mx-auto w-full max-w-3xl px-3 sm:px-4">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Study timer</h1>
        <p className="text-xs sm:text-sm text-gray-400">Track every minute you put in</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">Today's total</p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">
            {formatDuration(todayTotal)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">This week</p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">
            {formatDuration(weekTotal)}
          </p>
          <p className="text-xs text-gray-400 mt-1">last 7 days</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">Longest session</p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">
            {formatDuration(longestSession)}
          </p>
          <p className="text-xs text-gray-400 mt-1">all time</p>
        </div>

      </div>

      {/* Timer */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-8 flex flex-col items-center gap-5 sm:gap-6">

        {/* Status */}
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.style}`}>
          {status.label}
        </span>

        {/* Time */}
        <span className="text-4xl sm:text-6xl font-semibold text-gray-800 tracking-widest tabular-nums">
          {displayTime}
        </span>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">

          {/* Idle */}
          {seconds === 0 && !isRunning && (
            <button
              onClick={start}
              className="bg-indigo-600 text-white px-6 sm:px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Start
            </button>
          )}

          {/* Running */}
          {isRunning && (
            <>
              <button
                onClick={pause}
                className="bg-indigo-600 text-white px-5 sm:px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Pause
              </button>
              <button
                onClick={handleSave}
                className="border border-gray-200 text-gray-600 px-5 sm:px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Save
              </button>
              <button
                onClick={reset}
                className="border border-gray-200 text-gray-400 px-4 py-2.5 rounded-lg text-sm hover:border-red-200 hover:text-red-400 transition"
              >
                Discard
              </button>
            </>
          )}

          {/* Paused */}
          {seconds > 0 && !isRunning && (
            <>
              <button
                onClick={start}
                className="bg-indigo-600 text-white px-5 sm:px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Resume
              </button>
              <button
                onClick={handleSave}
                className="border border-gray-200 text-gray-600 px-5 sm:px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Save
              </button>
              <button
                onClick={reset}
                className="border border-gray-200 text-gray-400 px-4 py-2.5 rounded-lg text-sm hover:border-red-200 hover:text-red-400 transition"
              >
                Discard
              </button>
            </>
          )}

        </div>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 sm:px-5 py-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">Today's sessions</span>
          <span className="text-xs text-gray-400">
            {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} · {formatDuration(todayTotal)}
          </span>
        </div>

        {loading && (
          <p className="px-5 py-8 text-center text-sm text-gray-400">Loading sessions...</p>
        )}

        {!loading && todaySessions.length === 0 && (
          <EmptyState
            icon="⏱️"
            title="No sessions today"
            subtitle="Start the timer above"
          />
        )}

        {!loading && todaySessions.map((session, index) => (
          <div
            key={session.id}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-b border-gray-50 last:border-b-0"
          >
            {/* Number */}
            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-xs text-indigo-600 shrink-0">
              {todaySessions.length - index}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">
                Started{' '}
                {session.startedAt?.toDate().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-xs text-gray-400">
                {formatDuration(session.duration)}
              </p>
            </div>

            {/* Badge */}
            <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
              {formatDuration(session.duration)}
            </span>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Timer