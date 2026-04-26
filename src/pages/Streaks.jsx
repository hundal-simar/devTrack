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
    <div className="flex flex-col gap-4 sm:gap-5 justify-center mx-auto w-full max-w-3xl px-3 sm:px-4">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Streaks</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          Your consistency over time
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">Current streak</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-800">
            {currentStreak > 0 ? '🔥 ' : ''}{currentStreak}
          </p>
          <p className="text-xs text-gray-400 mt-1">days in a row</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">Longest streak</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-800">
            {longestStreak}
          </p>
          <p className="text-xs text-gray-400 mt-1">days — personal best</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">Active days</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-800">
            {activeLast30}
          </p>
          <p className="text-xs text-gray-400 mt-1">out of last 30</p>
        </div>

      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-3 sm:mb-4">
          <span className="text-sm font-medium text-gray-700">Last 30 days</span>
          <span className="text-xs text-gray-400">Each square = one day</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {calendarDays.map((day) => (
            <div
              key={day.date}
              title={day.date}
              className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded ${squareStyle(day)} transition-colors`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-xs text-gray-400">
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

      {/* Weekly Breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-700">Weekly breakdown</h2>
        </div>

        {weeklyBreakdown.map((week, wi) => {
          const activeDays = week.days.filter(Boolean).length

          return (
            <div
              key={wi}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 border-b border-gray-50 last:border-b-0"
            >
              {/* Label */}
              <span className="text-xs text-gray-500 sm:w-24">
                {week.label}
              </span>

              {/* Days */}
              <div className="flex gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap">
                {week.days.map((active, di) => (
                  <div
                    key={di}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${
                      active ? 'bg-indigo-500' : 'bg-gray-100'
                    }`}
                  />
                ))}
              </div>

              {/* Count */}
              <span className="text-xs text-gray-400 sm:w-16 sm:text-right">
                {activeDays} / 7
              </span>
            </div>
          )
        })}
      </div>

      {/* Empty */}
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