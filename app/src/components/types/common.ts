export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

export type TranslatableText = {
  ca: string
  es?: string
  en?: string
}

export type TagItem = {
  id: string
  text: TranslatableText
}

export type FilterItem = {
  id: number
  text: TranslatableText
  url?: string | null
  icon?: string | undefined
}

export type FilterOptions = {
  categories: FilterItem[]
  sustainability: FilterItem[]
}

export type Filters = {
  categories: string[]
  sustainability: string[]
}

export type Language = 'ca' | 'es'

export type HourState = {
  hour: string
  state: 'Obert' | 'Tancat'
}
export type ScheduleDay = {
  dayId: 1 | 2 | 3 | 4 | 5 | 6 | 7
  day:
    | 'Dilluns'
    | 'Dimarts'
    | 'Dimecres'
    | 'Dijous'
    | 'Divendres'
    | 'Dissabte'
    | 'Diumenge'
  hours: HourState[]
  stillOpenHour?: string
  closeNextDay?: boolean
}
export type Schedule = ScheduleDay[]
