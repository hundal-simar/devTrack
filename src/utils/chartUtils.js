import { dateString } from './streakUtils'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const buildWeeklyChartData = (sessions) =>
  Array.from({ length: 7 }, (_, i) => {
    const daysAgo   = 6 - i
    const dateStr   = dateString(daysAgo)
    const dayOfWeek = new Date(dateStr + 'T12:00:00').getDay()

    const totalSeconds = sessions
      .filter(s => s.date === dateStr)
      .reduce((sum, s) => sum + s.duration, 0)

    return {
      day:     DAY_LABELS[dayOfWeek],
      minutes: Math.round(totalSeconds / 60),
      isToday: daysAgo === 0,
    }
  })