import React from 'react'
import { ActivityIndicator, Dimensions } from 'react-native'
import { tabBarHeight } from '../../settings/theme'
import { styled } from 'styled-components/native'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  color?: string
  fullScreen?: boolean
}

const Loader: React.FC<Props> = ({
  color = 'black',
  fullScreen = false,
}: Props): React.ReactElement => {
  const insets = useSafeAreaInsets()

  const LoaderElement = (
    <ActivityIndicator
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      size="small"
      color={color}
    />
  )

  if (fullScreen) {
    return (
      <FullScreenContainer insets={insets}>{LoaderElement}</FullScreenContainer>
    )
  }
  return LoaderElement
}

export default Loader

const FullScreenContainer = styled.View<{ insets: EdgeInsets }>`
  height: ${({ insets }) =>
    Dimensions.get('window').height -
    tabBarHeight -
    insets.top -
    insets.bottom -
    40}px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
