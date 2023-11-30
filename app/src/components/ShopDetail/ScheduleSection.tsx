import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'
import SectionTitle from '../common/SectionTitle'
import { Schedule } from '../types'
import { formatHour } from '../../helpers/formatHour'
import { lang } from '../../helpers/language'
import { WEEK_DAYS } from '../../lib/localLiterals'

type Props = {
  schedule: Schedule
  literals: Record<string, string>
}

const ScheduleSection = ({ schedule, literals }: Props) => {
  // maximum number of hours in a day.
  // If it's 2, it means the shop opens from morning to afternoon.
  // If it's 4 means that the shop closes at noon and opens again in the afternoon.
  let hoursNumber = 0

  return (
    <Container>
      <SectionTitle text={literals[19]} />
      {WEEK_DAYS.map(day => {
        const item = schedule.find(i => i.dayId === day.id)

        if (item) {
          item.hours.forEach(h => {
            h.hour = formatHour(h.hour)
          })
          // Checks if the shop has morning and afternoon hours.
          // (variable hoursNumber: the maximum number of hours received in a day).
          if (hoursNumber < item.hours.length) {
            hoursNumber = item.hours.length
          }
        }

        return (
          <Row key={day.id}>
            <RowText>{lang(day.name)}</RowText>
            {item?.hours[0] && item?.hours[1] ? (
              <RowText>{`${item.hours[0].hour}-${item.hours[1].hour}`}</RowText>
            ) : (
              <ClosedText>{literals[16]}</ClosedText>
            )}
            {hoursNumber > 2 ? (
              <Fragment>
                {item?.hours[2] && item?.hours[3] ? (
                  <RowText>{`${item.hours[2].hour}-${item.hours[3].hour}`}</RowText>
                ) : (
                  // If shop has morning hours but none afternoon hours, show 'Closed' label.
                  // If shop is closed all day, show empty space (the 'Closed' label is shown above).
                  <Fragment>
                    {item?.hours[0] && item?.hours[1] ? (
                      <ClosedText>{literals[16]}</ClosedText>
                    ) : (
                      <Empty />
                    )}
                  </Fragment>
                )}
              </Fragment>
            ) : (
              <Empty />
            )}
          </Row>
        )
      })}
    </Container>
  )
}

const Container = styled.View`
  padding-top: ${theme.spacing['2.5']};
  padding-horizontal: ${theme.spacing[5]};
  padding-bottom: ${theme.spacing[8]};
`
const Row = styled.View`
  flex-direction: row;
  padding-top: ${theme.spacing[5]};
  align-items: center;
  justify-content: space-between;
`
const RowText = styled.Text`
  line-height: ${theme.fonts.height[22]};
  font-size: ${theme.fonts.size[16]};
  font-family: ${theme.fonts.notoSansMedium};
  flex: 1;
  color: ${theme.colors.black};
`
const ClosedText = styled.Text`
  line-height: ${theme.fonts.height[22]};
  font-size: ${theme.fonts.size[16]};
  font-family: ${theme.fonts.notoSansMedium};
  color: ${theme.colors.gray7A7A7A};
  flex: 1;
  color: ${theme.colors.black};
`
const Empty = styled.View`
  flex: 1;
`
export default ScheduleSection
