export function capitalize(text: string): string {
  const firtsChar = text.charAt(0).toUpperCase()
  const rest = text.replace(firtsChar, '').toLowerCase()
  return `${firtsChar}${rest}`
}
