export function formatHour(hour: string) {
  // Delete seconds from hour string
  const split = hour.split(':')
  return `${split[0]}:${split[1]}`
}