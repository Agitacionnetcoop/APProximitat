import React from 'react'
import { styled } from 'styled-components/native'
import { Dimensions, View } from 'react-native'
import { theme, shadow } from '../../settings/theme'
import ShopTags from './ShopTags'
import Image from '../common/Image'
import { ShopSummary } from '../types'
import ShopLogoTitle from '../common/ShopLogoTitle'

type Props = {
  item: ShopSummary
  onPress: () => void
}

const ShopCard: React.FC<Props> = ({
  onPress,
  item,
}: Props): React.ReactElement => {
  return (
    <Container style={shadow} onPress={onPress}>
      <Image
        image={item.images ? item.images[0] : ''}
        height={143}
        favoriteButton
        shopId={item.id}
      />
      <Content>
        <View>
          <ShopLogoTitle title={item.name} ellipsis />
          <Description numberOfLines={3} ellipsizeMode="tail">
            {item.description}
          </Description>
        </View>
        <ShopTags
          tags={item.tags}
          sustainabilityTags={item.sustainabilityTags}
          limit={4}
        />
      </Content>
    </Container>
  )
}
const Container = styled.TouchableOpacity`
  width: ${Dimensions.get('window').width - 40}px;
  margin-bottom: ${theme.spacing[2]};
  background-color: ${theme.colors.white};
  min-height: ${Dimensions.get('window').width - 40 * 0.9}px;
  flex: 1;
`
const Content = styled.View`
  padding-top: ${theme.spacing[4]};
  padding-horizontal: ${theme.spacing[5]};
  padding-bottom: ${theme.spacing[5]};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 100%;
  flex: 1;
`
const Description = styled.Text`
  padding-top: ${theme.spacing[2]};
  padding-bottom: ${theme.spacing[4]};
  line-height: ${theme.fonts.height[22]};
  color: ${theme.colors.black};
`

export default ShopCard
