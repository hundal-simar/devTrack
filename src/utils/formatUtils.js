export const formatDuration = (totalSeconds) => {
  if (totalSeconds < 60)   return '0m'
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}
export const relativeTime = (timestamp) => {
  if (!timestamp) return ''
  const dateVal = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)
  const diffDays = Math.floor(
    (new Date() - dateVal) / (1000 * 60 * 60 * 24)
  )
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  return `${diffDays} days ago`
}
