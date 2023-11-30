import { TranslatableText } from '../components/types/common'
import { useStore } from '../store/useStore'

export function lang(label?: string | TranslatableText): string {
  if (label === null || label === undefined) return ''
  if (typeof label === 'string') return label
  const language = useStore.getState().language
  return label[language] || ''
}

export function translateAll(
  literals?: Record<string, Record<string, string>>,
): Record<string, string> {
  const language = useStore.getState().language
  const literalsObj = {}
  if (!literals) return {}
  else {
    const keys = Object.keys(literals)
    keys.forEach(k =>
      Object.assign(literalsObj, { [k]: literals[k][language] }),
    )
  }
  return literalsObj
}
