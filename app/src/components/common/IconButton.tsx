import React from 'react'
import { Pressable, StyleProp, ImageStyle, ViewStyle } from 'react-native'
import { Icons } from '../../helpers/resolver'
import Icon from './Icon'
import Loader from './Loader'
import { styled } from 'styled-components/native'
import FastImage from 'react-native-fast-image'

type Props = {
  src?: string
  icon?: Icons
  onPress: () => void | Promise<void>
  customStyle?: StyleProp<ViewStyle>
  color?: string | null
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  size?: number | string
  iconHeight?: number
  iconWidth?: number
  iconStyles?: StyleProp<ImageStyle>
  loading?: boolean
  loadingColor?: string
  calculateWidth?: boolean
  notification?: boolean
  hitSlop?: number
}

const IconButton: React.FC<Props> = ({
  src,
  icon,
  onPress,
  customStyle = {},
  color = 'black',
  backgroundColor = 'transparent',
  borderColor,
  borderWidth = 1,
  size = 'auto',
  iconHeight = 20,
  iconWidth,
  iconStyles,
  loading = false,
  loadingColor,
  calculateWidth = true,
  notification = false,
  hitSlop = 0,
}: Props): React.ReactElement => {
  return (
    <Pressable hitSlop={hitSlop} onPress={() => onPress()} style={customStyle}>
      <Container
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        borderWidth={borderWidth}
        size={size}
      >
        {loading ? (
          <Loader color={loadingColor || color || 'black'} />
        ) : (
          <>
            {icon ? (
              <Icon
                icon={icon}
                color={color}
                height={iconHeight}
                width={iconWidth}
                customStyles={iconStyles}
                calculateWidth={calculateWidth}
                notification={notification}
              />
            ) : (
              <FastImage
                source={{ uri: src }}
                style={{ width: iconHeight, height: iconWidth }}
                resizeMode="contain"
              />
            )}
          </>
        )}
      </Container>
    </Pressable>
  )
}

const Container = styled.View<{
  backgroundColor: string
  borderColor?: string
  borderWidth: number
  size: number | string
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: ${({ borderColor, borderWidth }) =>
    borderColor ? `solid ${borderWidth}px ${borderColor}` : 'none'};
  aspect-ratio: 1/1;
  height: ${({ size }) => (typeof size === 'number' ? `${size}px` : size)};
`
export default IconButton
