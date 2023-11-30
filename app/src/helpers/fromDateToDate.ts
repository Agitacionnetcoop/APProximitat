import { useStore } from '../store/useStore'
import { lang } from './language'
import moment from 'moment'
import 'moment/locale/ca'
import 'moment/locale/es'
import { LITERALS } from '../lib/localLiterals'

export function fromDateToDate(
  initial: string,
  final: string,
): { date: string | null; hour: string | null } | null {
  const { language } = useStore.getState()

  const initialComponents = moment(initial).isValid()
    ? initial.split('T')
    : null
  const finalComponents = moment(final).isValid() ? final.split('T') : null

  const initialTime = initialComponents
    ? initialComponents[1].replace('.000Z', '')
    : null
  const finalTime = finalComponents
    ? finalComponents[1].replace('.000Z', '')
    : null

  const initialDate = initialComponents
    ? initialComponents[0].replace(/-/g, '/')
    : null
  let finalDate = finalComponents ? finalComponents[0].replace(/-/g, '/') : null

  if (initialDate === finalDate) {
    finalDate = null
  }

  const isSameMonth = initialDate
    ? initialDate.split('/')[1] === finalDate?.split('/')[1]
    : false

  const isSameYear = initialDate
    ? initialDate.split('/')[0] === finalDate?.split('/')[0]
    : false

  moment.locale(language)

  const initialFormattedDate =
    initialDate && initialTime
      ? `${
        isSameMonth && isSameYear
          ? moment(
            `${initialDate} ${initialTime}`,
            'YYYY/MM/DD hh:mm:ss',
          ).format('D')
          : `${
            language === 'es'
              ? moment(
                `${initialDate} ${initialTime}`,
                'YYYY/MM/DD hh:mm:ss',
              ).format(
                `D [de] MMMM ${
                  isSameMonth && !isSameYear ? '[de] YYYY' : ''
                }`,
              )
              : moment(
                `${initialDate} ${initialTime}`,
                'YYYY/MM/DD hh:mm:ss',
              ).format(
                `D MMMM ${isSameMonth && !isSameYear ? '[de] YYYY' : ''}`,
              )
          }`
      }`
      : null
  const finalFormattedDate =
    finalDate && finalTime
      ? `${
        language === 'es'
          ? moment(`${finalDate} ${finalTime}`, 'YYYY/MM/DD hh:mm:ss').format(
            `D [de] MMMM ${isSameMonth && !isSameYear ? '[de] YYYY' : ''}`,
          )
          : moment(`${finalDate} ${finalTime}`, 'YYYY/MM/DD hh:mm:ss').format(
            `D MMMM ${isSameMonth && !isSameYear ? '[de] YYYY' : ''}`,
          )
      }`
      : null

  const date = initialFormattedDate
    ? `${
      finalFormattedDate ? `${lang(LITERALS.from)} ` : ''
    }${initialFormattedDate}${
      finalFormattedDate ? ` ${lang(LITERALS.to)} ` : ''
    }${finalFormattedDate || ''}`
    : null

  return {
    date: date,
    hour:
      initialTime && finalTime
        ? `De ${initialTime?.replace(':00', '')} a ${finalTime?.replace(
          ':00',
          '',
        )}`
        : null,
  }
}
