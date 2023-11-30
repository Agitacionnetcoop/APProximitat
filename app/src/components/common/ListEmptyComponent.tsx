import React from 'react'
import styled from 'styled-components/native'
import { tabBarHeight, theme } from '../../settings/theme'
import { Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loader from './Loader'

type Props = {
  text: string
  loading?: boolean
}

const ListEmptyComponent = ({ text = '', loading = false }: Props) => {
  const insets = useSafeAreaInsets()
  const SCREEN_HEIGHT =
    (Dimensions.get('window').height -
      tabBarHeight -
      insets.top -
      insets.bottom) *
    0.8

  return (
    <Container height={SCREEN_HEIGHT}>
      {loading ? <Loader /> : <Message>{text}</Message>}
    </Container>
  )
}

const Container = styled.View<{ height: number }>`
  height: ${({ height }) => height}px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Message = styled.Text`
  font-family: ${theme.fonts.notoSansRegular};
  color: ${theme.colors.gray949494};
`

export default ListEmptyComponent
