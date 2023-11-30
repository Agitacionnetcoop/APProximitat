import React from 'react'
import { theme } from '../../settings/theme'
import { styled } from 'styled-components/native'
import { TranslatableText } from '../types'
import { lang } from '../../helpers/language'

type Props = {
  text: TranslatableText
  onPress: () => void
  invertColors?: boolean
}

const Tag = ({ text, onPress, invertColors = false }: Props) => {
  return (
    <Container onPress={onPress}>
      <Label invertColors={invertColors}>{lang(text).trim()}</Label>
    </Container>
  )
}

const Label = styled.Text<{ invertColors: boolean }>`
  color: ${({ invertColors }) =>
    invertColors ? theme.colors.primaryLight : theme.colors.primary};
  padding-horizontal: ${theme.spacing['2.5']};
  padding-vertical: ${theme.spacing['1.5']};
  background-color: ${({ invertColors }) =>
    invertColors ? theme.colors.primary : theme.colors.primaryLight};
  font-family: ${theme.fonts.notoSansMedium};
  font-size: ${theme.fonts.size[16]};
  line-height: ${theme.fonts.height[20]};
`
const Container = styled.TouchableOpacity`
  border-radius: 64px;
  overflow: hidden;
`
export default Tag
