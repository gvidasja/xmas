export const base64toUtf8 = str =>
  decodeURIComponent(
    atob(str)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )

export const formatDate = isoDate => {
  if (!isoDate) return ''

  const [date, time] = isoDate.split('T')
  const [hours, minutes] = time.split(':')

  return `${date} ${hours}:${minutes}`
}
