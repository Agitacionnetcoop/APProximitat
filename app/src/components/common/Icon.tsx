// @flow

import React from 'react'
import { View, Image, StyleProp, ImageStyle, ViewStyle } from 'react-native'
import resolver, { type Icons } from '../../helpers/resolver'
import { theme } from '../../settings/theme'

type Props = {
  icon: Icons
  width?: number
  height?: number
  customStyles?: StyleProp<ImageStyle>
  customContainerStyles?: StyleProp<ViewStyle>
  color?: string | null
  calculateWidth?: boolean
  notification?: boolean
}

const Icon = ({
  width = 28,
  height = 28,
  icon,
  customContainerStyles = {},
  customStyles = {},
  color = 'white',
  calculateWidth = false,
  notification = false,
}: Props) => {
  const source = resolver.icons[icon]
  const tintColor = color as string
  let calculatedWidth = 0
  if (calculateWidth) {
    calculatedWidth =
      (height * Image.resolveAssetSource(source).width) /
      Image.resolveAssetSource(source).height
  }

  const style: StyleProp<ImageStyle> = {
    width: calculateWidth ? calculatedWidth : width,
    height,
    tintColor,
  }

  if (!source) return null

  return (
    <View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.transparent,
        },
        customContainerStyles,
      ]}
    >
      {notification && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: theme.colors.notification,
            height: 8,
            width: 8,
            zIndex: 1,
            right: 0,
            top: 0,
            borderRadius: 25,
          }}
        />
      )}
      <Image style={[style, customStyles]} source={source} />
    </View>
  )
}

export default Icon
