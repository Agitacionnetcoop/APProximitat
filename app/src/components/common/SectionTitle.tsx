import React from 'react'
import { View, Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { theme } from '../../settings/theme'

type Props = {
  text: string
}
const SectionTitle = ({ text }: Props) => {
  return (
    <View>
      <Line />
      <Text>{text}</Text>
    </View>
  )
}

const Line = styled.View`
  border-bottom-color: ${theme.colors.grayB0B0B0};
  border-bottom-width: 0.75px;
  width: ${Dimensions.get('window').width}px;
  align-self: center;
`
const Text = styled.Text`
  line-height: ${theme.fonts.height[30]};
  font-size: ${theme.fonts.size[20]};
  font-family: ${theme.fonts.notoSansSemiBold};
  padding-top: ${theme.spacing[5]};
  color: ${theme.colors.black};
`
export default SectionTitle
