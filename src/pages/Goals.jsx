import { useState} from 'react'
import { useForm } from 'react-hook-form'
import useGoals from '../hooks/useGoals'
import SkeletonGoals from '../components/skeletons/SkeletonGoals'
import EmptyState from '../components/EmptyState'

const filters = ['All', 'Pending', 'Done']

const getTodayFormatted = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

function Goals() {
  const {
    goals,
    goalsloading,
    addGoal,
    toggleGoal,
    deleteGoal,
    totalGoals,
    completedGoals,
    progressPercent,
  } = useGoals()

  const [activeFilter, setActiveFilter] = useState('All')
  const { register, handleSubmit, reset,setFocus, formState: { errors } } = useForm()
 

  const onSubmit = async (data) => {
    await addGoal(data.goal)
    reset()
  }

  const filteredGoals = goals.filter((g) => {
    if (activeFilter === 'Pending') return !g.done
    if (activeFilter === 'Done') return g.done
    return true
  })

  const progressHint = () => {
    const remaining = totalGoals - completedGoals
    if (totalGoals === 0) return 'Add your first goal for today'
    if (remaining === 0) return 'All done! Great work today!'
    if (remaining === 1) return '1 goal remaining — almost there!'
    return `${remaining} goals remaining — keep going!`
  }

  if(goalsloading) {
    return <SkeletonGoals />
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 max-w-3xl mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Daily goals</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Stay on track, one goal at a time
          </p>
        </div>
        <span className="text-xs bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-slate-500 self-start sm:self-auto">
          {getTodayFormatted()}
        </span>
      </div>

      {/* Progress card */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">Today's progress</span>
          <span className="text-sm text-slate-400">
            {completedGoals} of {totalGoals} completed
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{progressHint()}</p>
      </div>

      {/* Add goal form */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
          
          <div className="flex flex-col flex-1 gap-1">
            <input
              type="text"
              placeholder="Add a new goal for today..."
              {...register('goal', {
                required: 'Please enter a goal',
                minLength: { value: 3, message: 'Goal must be at least 3 characters' },
                maxLength: { value: 100, message: 'Goal must be under 100 characters' },
              })}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 transition
                ${errors.goal
                  ? 'border-red-300 focus:ring-red-100'
                  : 'border-slate-200 focus:ring-blue-200 focus:border-blue-400'
                }`}
            />
            {errors.goal && (
              <p className="text-xs text-red-500 px-1">{errors.goal.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add goal
          </button>
        </form>
      </div>

      {/* Goals list */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm">

        {/* Filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-5 py-3 border-b border-slate-200">
          <span className="text-sm font-medium text-slate-700">Goals</span>
          
          <div className="flex gap-1 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors
                  ${activeFilter === f
                    ? 'bg-blue-100 text-blue-700 border-blue-200 font-medium'
                    : 'border-slate-200 text-slate-400 hover:bg-slate-100'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        
        {/* Empty */}
        {!goalsloading && filteredGoals.length === 0 && (
         <EmptyState
           icon="🎯"
           title={activeFilter === 'All' ? 'No goals yet' : `No ${activeFilter.toLowerCase()} goals`}
           subtitle={activeFilter === 'All' ? 'Set your intentions for today' : undefined}
           action={activeFilter === 'All' ? { label: 'Add your first goal', onClick: () => setFocus('goal') } : undefined}
          />
          )}

        {/* Goals */}
        {!goalsloading && filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-slate-100 last:border-b-0 group hover:bg-slate-100 transition-colors"
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleGoal(goal.id, goal.done)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                ${goal.done
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-slate-300 hover:border-blue-400'
                }`}
            >
              {goal.done && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            {/* Text */}
            <span className={`flex-1 text-sm transition-colors
              ${goal.done ? 'line-through text-slate-400' : 'text-slate-700'}`}
            >
              {goal.text}
            </span>

            {/* Delete */}
            <button
              onClick={() => deleteGoal(goal.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all text-lg px-1"
            >
              ×
            </button>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Goals