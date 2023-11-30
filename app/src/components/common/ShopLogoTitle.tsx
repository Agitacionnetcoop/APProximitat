import React from 'react'
import styled from 'styled-components/native'
import { theme } from '../../settings/theme'
// import Icon from './Icon'

type Props = {
  title: string
  fontSize?: number
  lineHeight?: number
  ellipsis?: boolean
}
const ShopLogoTitle = ({
  title,
  fontSize = 24,
  lineHeight = 30,
  ellipsis = false,
}: Props) => {
  return (
    <Container ellipsis={ellipsis}>
      <Title
        style={{ fontSize: fontSize, lineHeight: lineHeight }}
        numberOfLines={ellipsis ? 1 : undefined}
        ellipsizeMode="tail"
      >
        {title}
      </Title>
    </Container>
  )
}

const Container = styled.View<{ ellipsis: boolean }>`
  width: 100%;
  flex-direction: row;
  gap: ${theme.spacing['2.5']};
  align-items: ${({ ellipsis }) => (ellipsis ? 'center' : 'flex-start')};
`
const Title = styled.Text`
  width: 100%;
  font-family: ${theme.fonts.merriweatherBlack};
  padding-right: ${theme.spacing[5]};
  color: ${theme.colors.black};
`
export default ShopLogoTitle
