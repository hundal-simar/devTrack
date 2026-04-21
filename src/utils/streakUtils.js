// Returns YYYY-MM-DD string for N days ago
export const dateString = (daysAgo = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

// Returns array of last N date strings, oldest first
export const lastNDays = (n) =>
  Array.from({ length: n }, (_, i) => dateString(n - 1 - i))

// Current streak — consecutive days going back from today
// If today has no session, checks if yesterday does (grace period)
export const calculateStreak = (activeDateSet) => {
  if (activeDateSet.size === 0) return 0

  let streak = 0
  // Start from today — if today not active, start from yesterday
  let startOffset = activeDateSet.has(dateString(0)) ? 0 : 1

  for (let daysAgo = startOffset; ; daysAgo++) {
    if (activeDateSet.has(dateString(daysAgo))) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Longest ever streak
export const calculateLongestStreak = (activeDateSet) => {
  if (activeDateSet.size === 0) return 0

  // Get sorted unique dates
  const sorted = [...activeDateSet].sort()
  let longest = 0
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (curr - prev) / (1000 * 60 * 60 * 24)

    if (diff === 1) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  return Math.max(longest, current)
}

// 30-day calendar grid data
export const buildCalendarDays = (activeDateSet) =>
  Array.from({ length: 30 }, (_, i) => {
    const daysAgo = 29 - i
    const date    = dateString(daysAgo)
    return {
      date,
      isActive: activeDateSet.has(date),
      isToday:  daysAgo === 0,
    }
  })

// 4 weeks × 7 days breakdown
export const buildWeeks = (activeDateSet) =>
  Array.from({ length: 4 }, (_, weekIndex) => ({
    label: weekIndex === 0 ? '3 weeks ago'
         : weekIndex === 1 ? '2 weeks ago'
         : weekIndex === 2 ? 'Last week'
         : 'This week',
    days: Array.from({ length: 7 }, (_, dayIndex) => {
      const daysAgo = (3 - weekIndex) * 7 + (6 - dayIndex)
      return activeDateSet.has(dateString(daysAgo))
    }),
  }))