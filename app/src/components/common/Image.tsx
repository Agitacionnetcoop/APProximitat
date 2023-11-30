// @flow

import React from 'react'
import FastImage, { ResizeMode } from 'react-native-fast-image'
import { theme } from '../../settings/theme'
import FavoriteButton from './FavoriteButton'
import { View, Image as RNImage } from 'react-native'
import resolver from '../../helpers/resolver'

type Props = {
  image: string
  height?: number | string
  width?: number | string
  favoriteButton?: boolean
  resizeMode?: ResizeMode
  shopId?: number
}

const Image = ({
  image = '',
  height = 143,
  width = '100%',
  favoriteButton = false,
  resizeMode = 'cover',
  shopId,
}: Props) => {
  if (!image) {
    // Image placeholder
    const icon = resolver.icons['not_found']
    const iconHeight = typeof height === 'number' ? height * 0.5 : 60
    return (
      <>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height,
            width,
            backgroundColor: theme.colors.grayD9D9D9,
          }}
        >
          <RNImage
            source={icon}
            style={{
              height: iconHeight,
              width:
                (Number(iconHeight) * RNImage.resolveAssetSource(icon).width) /
                RNImage.resolveAssetSource(icon).height,
              tintColor: theme.colors.white,
            }}
            resizeMode={resizeMode}
          />
        </View>
        {favoriteButton && shopId && <FavoriteButton shopId={shopId} />}
      </>
    )
  }

  return (
    <>
      <FastImage
        source={{ uri: image }}
        style={{ height: height, width: width }}
        resizeMode={resizeMode}
      />
      {favoriteButton && shopId && <FavoriteButton shopId={shopId} />}
    </>
  )
}

export default Image
