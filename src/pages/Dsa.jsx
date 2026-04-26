import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useProblems, TOPICS, DIFFICULTIES } from '../hooks/useProblems'
import { relativeTime } from '../utils/formatUtils'
import SkeletonDsa from '../components/skeletons/SkeletonDsa'
import EmptyState from '../components/EmptyState'

const difficultyStyle = (difficulty) => {
  if (difficulty === 'Easy')   return 'bg-green-50 text-green-700'
  if (difficulty === 'Medium') return 'bg-amber-50 text-amber-700'
  if (difficulty === 'Hard')   return 'bg-red-50 text-red-700'
  return ''
}



const filters = ['All', ...DIFFICULTIES]

function DSA() {
  const { problems, problemsloading, addProblem, deleteProblem, topicStats, totalSolved } = useProblems()
  const [activeFilter, setActiveFilter] = useState('All')
  const { register, handleSubmit, reset, setFocus, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    await addProblem(data)
    reset()
    setFocus('name')
  }

  const filteredProblems = problems.filter(p =>
    activeFilter === 'All' ? true : p.difficulty === activeFilter
  )

  if (problemsloading) {
    return <SkeletonDsa />
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 mx-auto w-full max-w-6xl px-3 sm:px-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">DSA tracker</h1>
          <p className="text-xs sm:text-sm text-gray-400">Track every problem you solve</p>
        </div>

        <span className="self-start sm:self-auto text-xs bg-indigo-50 text-indigo-700 font-medium rounded-full px-3 py-1.5">
          {totalSolved} solved total
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-3 sm:mb-4">Log a problem</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Problem name</label>
              <input
                type="text"
                placeholder="e.g. Two Sum"
                {...register('name', {
                  required: 'Problem name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 transition
                  ${errors.name
                    ? 'border-red-300 focus:ring-red-100'
                    : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-400'}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Topic + Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Topic</label>
                <select
                  {...register('topic', { required: 'Pick a topic' })}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 bg-white
                    ${errors.topic
                      ? 'border-red-300 focus:ring-red-100'
                      : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-400'}`}
                >
                  <option value="">Select topic</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.topic && <p className="text-xs text-red-500">{errors.topic.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Difficulty</label>
                <select
                  {...register('difficulty', { required: 'Pick a difficulty' })}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 bg-white
                    ${errors.difficulty
                      ? 'border-red-300 focus:ring-red-100'
                      : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-400'}`}
                >
                  <option value="">Select</option>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.difficulty && <p className="text-xs text-red-500">{errors.difficulty.message}</p>}
              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition"
            >
              Log problem
            </button>

          </form>
        </div>

        {/* Topic Progress */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-3 sm:mb-4">Progress by topic</h2>

          <div className="flex flex-col gap-3">
            {topicStats.map(({ name, count, percent }) => (
              <div key={name} className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs text-gray-500 w-20 sm:w-24 truncate">{name}</span>

                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="text-xs text-gray-400 w-10 text-right shrink-0">
                  {count}/30
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Problems List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-5 py-3 border-b border-gray-100">

          <span className="text-sm font-medium text-gray-700">Recent problems</span>

          {/* Scrollable filters on mobile */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap
                  ${activeFilter === f
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium'
                    : 'border-gray-100 text-gray-400'}`}
              >
                {f}
              </button>
            ))}
          </div>

        </div>

        {/* Empty */}
        {!filteredProblems.length && (
          <EmptyState
            icon="📭"
            title="No problems logged"
            subtitle="Start tracking your DSA journey"
            action={{ label: 'Log a problem', onClick: () => setFocus('name') }}
          />
        )}

        {/* Rows */}
        {filteredProblems.map(problem => (
          <div
            key={problem.id}
            className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-gray-50 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{problem.name}</p>
              <p className="text-xs text-gray-400">
                {problem.topic} · {relativeTime(problem.solvedAt)}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyStyle(problem.difficulty)}`}>
                {problem.difficulty}
              </span>

              <button
                onClick={() => deleteProblem(problem.id)}
                className="text-gray-300 hover:text-red-400 text-lg"
              >
                ×
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}
export default DSA
//to add edit problem and search problem features in the future, we can create a modal component that opens when clicking on a problem row. This modal would contain a form pre-filled with the problem's current details, allowing the user to make changes and save them. For searching, we can add a search input above the recent problems list that filters the displayed problems based on the input text matching the problem name or topic.