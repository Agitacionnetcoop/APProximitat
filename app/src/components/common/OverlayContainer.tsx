import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'
import { useIsFocused } from '@react-navigation/native'

import { theme } from '../../settings/theme'
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import IconButton from './IconButton'
import { NavigationType } from '../types'

const OverlayContainer = ({
  children,
  onClose,
  customStyle,
  closeButton = true,
  backgroundColor = theme.colors.white,
}: {
  children: React.ReactNode[] | React.ReactNode
  onClose?: () => void
  customStyle?: StyleProp<ViewStyle>
  closeButton?: boolean
  backgroundColor?: string
}) => {
  const isFocused = useIsFocused()
  const containerRef = useRef<any>()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationType>()

  useEffect(() => {
    if (containerRef.current && isFocused) {
      containerRef.current.scrollTo({
        y: 0,
        animated: false,
      })
    }
  }, [containerRef, isFocused])

  return (
    <ScrollView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: backgroundColor,
      }}
      showsVerticalScrollIndicator={false}
      ref={containerRef}
    >
      <Head>
        {closeButton && (
          <IconButton
            onPress={
              onClose
                ? onClose
                : () => {
                    navigation.goBack()
                  }
            }
            icon="close"
            iconHeight={31}
            calculateWidth
            color={null}
          />
        )}
      </Head>
      <View style={customStyle}>{children}</View>
    </ScrollView>
  )
}

export default OverlayContainer

const Head = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-vertical: ${theme.spacing[5]};
  padding-horizontal: ${theme.spacing[10]};
`
