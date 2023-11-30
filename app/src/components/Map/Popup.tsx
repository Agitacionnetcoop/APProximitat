import React from 'react'
import styled from 'styled-components/native'
import Image from '../common/Image'
import { shadow, theme } from '../../settings/theme'
import ShopLogoTitle from '../common/ShopLogoTitle'
import { Marker } from './MapScreen'
import { NavigationType } from '../types'
import { Dimensions } from 'react-native'

const Popup = ({
  navigation,
  item,
}: {
  navigation: NavigationType
  item: Marker
}) => {
  return (
    <Container
      style={shadow}
      onPress={() => navigation.navigate('ShopDetail', { id: item.id })}
    >
      <Image
        image={item.images?.length > 0 ? item.images[0] : ''}
        height={115}
        favoriteButton
        shopId={item.id}
      />
      <Content>
        <ShopLogoTitle title={item.name} ellipsis />
        {item.description && (
          <Description numberOfLines={3} ellipsizeMode="tail">
            {item.description}
          </Description>
        )}
      </Content>
    </Container>
  )
}

export default Popup

const Container = styled.Pressable`
  position: absolute;
  background: white;
  width: ${Dimensions.get('window').width * 0.65}px;
  min-height: ${Dimensions.get('window').width * 0.65 * 0.94}px;
  display: flex;
  flex-direction: column;
  transform: translateY(-60px);
`
const Content = styled.View`
  padding-horizontal: ${theme.spacing[4]};
  padding-vertical: ${theme.spacing[2]};
  flex: 1;
`
const Description = styled.Text`
  padding-top: ${theme.spacing[1]};
  font-family: ${theme.fonts.notoSansRegular};
  font-size: ${theme.fonts.size[13]};
  line-height: ${theme.fonts.height[18]};
  color: ${theme.colors.black};
`
