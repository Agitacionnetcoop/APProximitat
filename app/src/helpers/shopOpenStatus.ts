import { Schedule, ScheduleDay, TranslatableText } from '../components/types'
import { formatHour } from './formatHour'
import { lang } from './language'

export type ShopStatus = {
  text: string
  statusText?: string
  status?: 'open' | 'closed'
}

type WeekDayLiteral = { id: number; name: TranslatableText }

const AT: TranslatableText = {
  ca: 'a les',
  es: 'a las',
}

export const WEEK_DAYS: WeekDayLiteral[] = [
  { id: 1, name: { ca: 'Dilluns', es: 'Lunes' } },
  { id: 2, name: { ca: 'Dimarts', es: 'Martes' } },
  { id: 3, name: { ca: 'Dimecres', es: 'Miércoles' } },
  { id: 4, name: { ca: 'Dijous', es: 'Jueves' } },
  { id: 5, name: { ca: 'Divendres', es: 'Viernes' } },
  { id: 6, name: { ca: 'Dissabte', es: 'Sábado' } },
  { id: 7, name: { ca: 'Diumenge', es: 'Domingo' } },
]

export const isHourBigger = (hour1: string, hour2: string) => {
  return (
    Number(formatHour(hour1).replace(':', '')) >
    Number(formatHour(hour2).replace(':', ''))
  )
}

export const getShopOpenStatus = (
  literals: Record<string, string>,
  schedule: Schedule,
): ShopStatus => {
  const currentDay = new Date().getDay()
  const today = schedule.find(i => i.dayId === currentDay)
  const currentHour = new Date().toLocaleString('es-EU', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })

  let nextOpen = ''
  if (schedule.length > 0) {
    nextOpen = getNextOpenDay(
      literals,
      schedule,
      currentHour,
      currentDay,
      today,
    )
  }

  let shopStatus = {
    text: nextOpen ? `. ${nextOpen}` : '',
    statusText: literals[16],
    status: 'closed',
  } // status closed

  if (today) {
    const splitSchedule = today.hours.length > 2
    const closeNextDay =
      isHourBigger(today.hours[0].hour, today.hours[1].hour) ||
      (splitSchedule && isHourBigger(today.hours[2].hour, today.hours[3].hour))
    const prevDayId = today.dayId === 1 ? 7 : today.dayId - 1
    const prevDay = schedule.find(i => i.dayId === prevDayId)

    if (prevDay) {
      // Shop was open the day before
      const prevDaySplitSchedule = prevDay.hours.length > 2
      const prevDayClosesToday =
        (isHourBigger(prevDay.hours[0].hour, prevDay.hours[1].hour) &&
          (today.hours[1].hour !== '00:00:00' ||
            (splitSchedule && today.hours[3].hour !== '00:00:00'))) ||
        (prevDaySplitSchedule &&
          isHourBigger(prevDay.hours[2].hour, prevDay.hours[3].hour))
      if (prevDayClosesToday) {
        Object.assign(today, {
          stillOpenHour: prevDaySplitSchedule
            ? prevDay.hours[3].hour
            : prevDay.hours[1].hour,
        })
      }

      if (closeNextDay) {
        Object.assign(today, { closeNextDay: closeNextDay })
      }

      if (today.closeNextDay || today.stillOpenHour) {
        // Shop opens until next day (past 24:00)
        const isOpen =
          (!splitSchedule &&
            isHourBigger(currentHour, today.hours[0].hour) &&
            (isHourBigger(today.hours[1].hour, currentHour) ||
              today.closeNextDay)) ||
          (splitSchedule &&
            isHourBigger(currentHour, today.hours[2].hour) &&
            (isHourBigger(today.hours[3].hour, currentHour) ||
              today.closeNextDay)) ||
          (today.stillOpenHour &&
            isHourBigger(today.stillOpenHour, currentHour))

        if (isOpen) {
          shopStatus = { text: '', statusText: literals[66], status: 'open' } // status open
        }
      } else {
        // Shop open and close the same day
        const isOpen =
          (isHourBigger(currentHour, today.hours[0].hour) &&
            isHourBigger(today.hours[1].hour, currentHour)) ||
          (today.hours.length > 2 &&
            isHourBigger(currentHour, today.hours[2].hour) &&
            isHourBigger(today.hours[3].hour, currentHour))

        if (isOpen) {
          shopStatus = { text: '', statusText: literals[66], status: 'open' } // status open
        }
      }
    } else {
      // Shop was closed the day before
      const isOpen =
        (isHourBigger(currentHour, today.hours[0].hour) &&
          isHourBigger(today.hours[1].hour, currentHour)) ||
        (today.hours.length > 2 &&
          isHourBigger(currentHour, today.hours[2].hour) &&
          isHourBigger(today.hours[3].hour, currentHour))

      if (isOpen) {
        shopStatus = { text: '', statusText: literals[66], status: 'open' } // status open
      }
    }
  }
  return shopStatus as ShopStatus
}

export const getNextOpenDay = (
  literals: Record<string, string>,
  schedule: Schedule,
  currentHour: string,
  currentDayId: number,
  today?: ScheduleDay,
): string => {
  const todayNextOpenHour =
    today?.hours
      .filter(h => h.state === 'Obert')
      .find(o => isHourBigger(o.hour, currentHour)) || undefined

  if (todayNextOpenHour) {
    // Shop opens today.
    return `${literals[17]} ${lang(AT)} ${formatHour(todayNextOpenHour.hour)}.`
  } else {
    // Shop has already closed for today and opens tomorrow.
    if (today) {
      const todayIndex = schedule.indexOf(today)
      const nextOpeningDay =
        todayIndex === schedule.length - 1
          ? schedule[0]
          : schedule[todayIndex + 1]
      const nextOpeningHour = nextOpeningDay.hours.filter(
        h => h.state === 'Obert',
      )[0]
      const dayLiteral = WEEK_DAYS.find(
        d => d.id === nextOpeningDay.dayId,
      )?.name
      return `${literals[17]} ${lang(dayLiteral) || nextOpeningDay.day} ${lang(
        AT,
      )} ${formatHour(nextOpeningHour.hour)}.`
    } else {
      // Shop was closed the whole day today, but opens tomorrow.
      const nextDayId = currentDayId + 1 <= 7 ? currentDayId + 1 : 1
      const nextDay = schedule.find(d => d.dayId === nextDayId)

      if (nextDay) {
        const dayLiteral = WEEK_DAYS.find(d => d.id === nextDay.dayId)?.name
        const nextHours = nextDay.hours.filter(h => h.state === 'Obert')[0]
        return `${literals[17]} ${lang(dayLiteral) || nextDay.day} ${lang(
          AT,
        )} ${formatHour(nextHours.hour)}.`
      } else {
        // Shop was closed the whole day today and the day after. Find the next opening day.
        const nextDay =
          currentDayId < schedule[0].dayId
            ? schedule.find(d => d.dayId > currentDayId)
            : schedule[0]
        if (nextDay) {
          const dayLiteral = WEEK_DAYS.find(d => d.id === nextDay.dayId)?.name
          const nextHours = nextDay?.hours.filter(h => h.state === 'Obert')[0]
          return `${literals[17]} ${lang(dayLiteral) || nextDay.day} ${lang(
            AT,
          )} ${formatHour(nextHours.hour)}.`
        } else return ''
      }
    }
  }
}
