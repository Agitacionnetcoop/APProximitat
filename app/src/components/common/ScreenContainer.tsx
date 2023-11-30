import React from 'react'
import styled from 'styled-components/native'
import { ScrollViewProps, StatusBar } from 'react-native'

import { tabBarHeight, theme } from '../../settings/theme'
import Loader from './Loader'

interface Props extends ScrollViewProps {
  children: React.ReactNode[] | React.ReactNode
  backgroundColor?: string
  paddingHorizontal?: number
  tabbar?: boolean
  disableScrollView?: boolean
  loadingContent?: boolean
}
const ScreenContainer = ({
  children,
  backgroundColor = theme.colors.background,
  paddingHorizontal = 20,
  tabbar = true,
  disableScrollView = false,
  loadingContent = false,
  ...props
}: Props) => {
  if (disableScrollView) {
    return (
      <NoScrollContainer
        backgroundColor={backgroundColor}
        paddingHorizontal={paddingHorizontal}
        tabbar={tabbar}
      >
        <StatusBar barStyle={'dark-content'} />
        {loadingContent ? <Loader fullScreen /> : children}
      </NoScrollContainer>
    )
  }

  return (
    <Container
      backgroundColor={backgroundColor}
      paddingHorizontal={paddingHorizontal}
      contentContainerStyle={{ paddingBottom: tabbar ? tabBarHeight + 20 : 20 }}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      <StatusBar barStyle={'dark-content'} />
      {loadingContent ? <Loader fullScreen /> : children}
    </Container>
  )
}

const Container = styled.ScrollView<{
  backgroundColor: string
  paddingHorizontal: number
}>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding-horizontal: ${({ paddingHorizontal }) => paddingHorizontal}px;
`
const NoScrollContainer = styled.View<{
  backgroundColor: string
  paddingHorizontal: number
  tabbar: boolean
}>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding-horizontal: ${({ paddingHorizontal }) => paddingHorizontal}px;
  padding-bottom: ${({ tabbar }) => (tabbar ? `${tabBarHeight}px` : '20px')};
`

export default ScreenContainer
