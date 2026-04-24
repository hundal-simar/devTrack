import { useStreak } from '../hooks/useStreak'
import { squareStyle } from '../utils/streakUtils'
import SkeletonStreaks from '../components/skeletons/SkeletonStreaks'
import EmptyState from '../components/EmptyState'


function Streaks() {
  const {
    loading,
    currentStreak,
    longestStreak,
    activeLast30,
    calendarDays,
    weeklyBreakdown,
  } = useStreak()

  if (loading) {
    return <SkeletonStreaks />
  }

  return (
    <div className="flex flex-col gap-5 justify-center mx-auto max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Streaks</h1>
        <p className="text-sm text-gray-400 mt-0.5">Your consistency over time</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">Current streak</p>
          <p className="text-2xl font-semibold text-gray-800">
            {currentStreak > 0 ? '🔥 ' : ''}{currentStreak}
          </p>
          <p className="text-xs text-gray-400 mt-1">days in a row</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">Longest streak</p>
          <p className="text-2xl font-semibold text-gray-800">{longestStreak}</p>
          <p className="text-xs text-gray-400 mt-1">days — personal best</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 mb-1">Active days</p>
          <p className="text-2xl font-semibold text-gray-800">{activeLast30}</p>
          <p className="text-xs text-gray-400 mt-1">out of last 30</p>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Last 30 days</span>
          <span className="text-xs text-gray-400">Each square = one day</span>
        </div>

        {/* Grid */}
        <div className="flex flex-wrap gap-1.5">
          {calendarDays.map((day) => (
            <div
              key={day.date}
              title={day.date}
              className={`w-6 h-6 rounded ${squareStyle(day)} transition-colors cursor-default`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <span>No activity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-indigo-400" />
            <span>Studied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-indigo-600 ring-2 ring-indigo-400 ring-offset-1" />
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Weekly breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Weekly breakdown</h2>
        </div>

        {weeklyBreakdown.map((week, wi) => {
          const activeDays = week.days.filter(Boolean).length
          return (
            <div
              key={wi}
              className="flex items-center gap-4 px-5 py-3 border-b border-gray-50 last:border-b-0"
            >
              {/* Week label */}
              <span className="text-xs text-gray-500 w-24 shrink-0">{week.label}</span>

              {/* 7 day dots */}
              <div className="flex gap-1.5 flex-1">
                {week.days.map((active, di) => (
                  <div
                    key={di}
                    className={`w-4 h-4 rounded-sm ${active ? 'bg-indigo-500' : 'bg-gray-100'}`}
                  />
                ))}
              </div>

              {/* Count */}
              <span className="text-xs text-gray-400 w-14 text-right shrink-0">
                {activeDays} / 7 days
              </span>
            </div>
          )
        })}

      </div>

      {/* Empty state if no sessions at all */}
      {activeLast30 === 0 && (
        <EmptyState
          icon="📉"
          title="No activity in the last 30 days"
          subtitle="Consistency is key! Start a streak by studying today."
          action={{ label: 'Start studying', to: '/timer' }}
        />
      )}

    </div>
  )
}

export default Streaks
//intensity levels like github 