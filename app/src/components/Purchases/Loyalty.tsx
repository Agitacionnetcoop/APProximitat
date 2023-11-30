import React from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'

import Icon from '../common/Icon'

type Props = {
  number?: number
  maxNumber?: number
  color?: string
}

const Loyalty: React.FC<Props> = ({
  number = 0,
  maxNumber = 6,
  color = theme.colors.primaryLight,
}) => {
  return (
    <Container>
      {Array.from({ length: maxNumber }).map((i, index) => {
        if (number >= index + 1) {
          return (
            <Circle key={index} color={color}>
              <Icon icon="check" color={null} calculateWidth height={15} />
            </Circle>
          )
        }
        return <Circle key={index} />
      })}
    </Container>
  )
}

export default Loyalty

const Container = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: ${theme.spacing[2]};
  padding-vertical: ${theme.spacing[4]};
`
const Circle = styled.View<{ color?: string }>`
  background-color: ${({ color }) => (color ? color : theme.colors.grayD9D9D9)};
  width: ${theme.spacing[10]};
  height: ${theme.spacing[10]};
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`
