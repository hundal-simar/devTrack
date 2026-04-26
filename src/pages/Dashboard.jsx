import { useAuth }     from '../context/AuthContext'
import  useGoals     from '../hooks/useGoals'
import { useProblems } from '../hooks/useProblems'
import { useSessions } from '../hooks/useSessions'
import { useStreak }   from '../hooks/useStreak'
import { buildWeeklyChartData } from '../utils/chartUtils'
import { formatDuration, relativeTime } from '../utils/formatUtils'
import { squareStyle } from '../utils/streakUtils'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import SkeletonDashboard from '../components/skeletons/SkeletonDashboard'
import EmptyState from '../components/EmptyState'

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const getMotivation = (streak) => {
  if (streak === 0) return 'Start your streak today!'
  if (streak < 3)   return 'Great start — keep going!'
  if (streak < 7)   return 'Building momentum!'
  return 'Keep the streak alive!'
}

const getTodayFormatted = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const mins = payload[0].value
  const text = mins === 0 ? 'No study'
    : mins < 60 ? `${mins}m`
    : `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ''}`
  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-1.5 text-xs text-gray-700">
      {label}: {text}
    </div>
  )
}

// export so Dashboard.jsx and Streaks.jsx both use it
export const squareStyleLocal = (day) => {
  if (day.isToday && day.isActive) return 'bg-indigo-600 ring-2 ring-indigo-400 ring-offset-1'
  if (day.isToday)                 return 'bg-indigo-200 ring-2 ring-indigo-300 ring-offset-1'
  if (day.isActive)                return 'bg-indigo-400'
  return 'bg-gray-100'
}

function Dashboard() {
  const { user } = useAuth()
  const { goals, completedGoals, totalGoals, goalsloading } = useGoals()
  const { problems, totalSolved, todayCount, problemsloading } = useProblems()
  const { sessions, todayTotal, todaySessions } = useSessions()
  const { currentStreak, calendarDays, loading } = useStreak()

  const firstName = user?.displayName?.split(' ')[0] ?? 'there'
  const chartData = buildWeeklyChartData(sessions)
  const recentFour = problems.slice(0, 4)

  if (loading || goalsloading || problemsloading) {
    return <SkeletonDashboard />
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 mx-auto w-full max-w-6xl px-3 sm:px-4">

      {/* Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          {getTodayFormatted()} — {getMotivation(currentStreak)}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">Current streak</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-800">
            {currentStreak > 0 ? '🔥 ' : ''}{currentStreak}
          </p>
          <p className="text-xs text-indigo-500 mt-1">days in a row</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">Problems solved</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-800">{totalSolved}</p>
          <p className="text-xs text-green-600 mt-1">
            {todayCount > 0 ? `+${todayCount} today` : 'none today'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">Study time today</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-800">
            {formatDuration(todayTotal)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
          <p className="text-xs text-gray-400 mb-1">Goals today</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-800">
            {completedGoals} / {totalGoals}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {totalGoals === 0
              ? 'no goals set'
              : `${Math.round((completedGoals / totalGoals) * 100)}% done`}
          </p>
        </div>

      </div>

      {/* Streak calendar + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">

        {/* Streak */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm font-medium text-gray-700">Streak calendar</h2>
            <Link to="/streaks" className="text-xs text-indigo-500 hover:underline">
              View details
            </Link>
          </div>

          <div className="flex flex-wrap gap-1">
            {calendarDays.map(day => (
              <div
                key={day.date}
                title={day.date}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${squareStyleLocal(day)}`}
              />
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-3 sm:mb-4">
            Study time this week
          </h2>

          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={chartData} barCategoryGap="30%">
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.isToday ? '#4f46e5' : '#e0e7ff'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Goals + Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">

        {/* Goals */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm font-medium text-gray-700">Today's goals</h2>
            <Link to="/goals" className="text-xs text-indigo-500 hover:underline">
              View all
            </Link>
          </div>

          {goals.length === 0 ? (
            <EmptyState
              icon="🎯"
              title="No goals set"
              subtitle="Add goals for today"
              action={{ label: 'Set goals', to: '/goals' }}
            />
          ) : (
            <div className="flex flex-col">
              {goals.slice(0, 5).map(goal => (
                <div key={goal.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-b-0">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                    ${goal.done ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {goal.done && (
                      <svg width="8" height="8" viewBox="0 0 10 10">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" />
                      </svg>
                    )}
                  </div>

                  <span className={`text-sm flex-1 ${
                    goal.done ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}>
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Problems */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm font-medium text-gray-700">Recent problems</h2>
            <Link to="/dsa" className="text-xs text-indigo-500 hover:underline">
              View all
            </Link>
          </div>

          {recentFour.length === 0 ? (
            <EmptyState
              icon="🧩"
              title="No problems logged"
              subtitle="Start tracking your DSA journey"
              action={{ label: 'Log a problem', to: '/dsa' }}
            />
          ) : (
            <div className="flex flex-col">
              {recentFour.map(problem => (
                <div key={problem.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
                  <div className="pr-2">
                    <p className="text-sm text-gray-700 font-medium truncate">
                      {problem.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {problem.topic} · {relativeTime(problem.solvedAt)}
                    </p>
                  </div>

                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap
                    ${problem.difficulty === 'Easy' ? 'bg-green-50 text-green-700'
                    : problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700'
                    : 'bg-red-50 text-red-700'}`}>
                    {problem.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
export default Dashboard