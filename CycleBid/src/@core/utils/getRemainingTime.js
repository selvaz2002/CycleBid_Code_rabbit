

export const getRemainingTime = bidEndingOn => {
  if (!bidEndingOn) return { label: '-', color: 'secondary' }

  const endDate = new Date(bidEndingOn)
  if (isNaN(endDate)) return { label: '-', color: 'secondary' }

  const now = new Date()
  const diffMs = endDate - now

  if (diffMs <= 0) return { label: 'Expired', color: 'error' }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  const timeFormatted = `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(
    diffSeconds
  ).padStart(2, '0')}`

  return { label: diffDays > 1 ? `${diffDays} days` : timeFormatted, color: 'secondary' }
}

export   const formatDay = dateString => {
  const date = new Date(dateString)
  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
  return `${formattedDate}`
}


export   const formatDate = dateStr => {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}


export const getRemainingTime1 = bidEndingOn => {
  if (!bidEndingOn) return '-'
  const endDate = new Date(bidEndingOn)
  const now = new Date()
  const diffMs = endDate - now
  if (diffMs <= 0) return 'Expired'
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000)
  const timeFormatted = `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:${String(
    diffSeconds
  ).padStart(2, '0')}`
  return diffDays > 1 ? `${diffDays} days` : timeFormatted
}
