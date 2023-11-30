import React from 'react'
import styled from 'styled-components/native'

import { shadow, theme } from '../../settings/theme'
import { NavigationType, Purchase } from '../types'

import Image from '../common/Image'
import ShopLogoTitle from '../common/ShopLogoTitle'
import Loyalty from './Loyalty'
import ButtonRounded from '../common/ButtonRounded'
import { useNavigation } from '@react-navigation/native'
import { useStore } from '../../store/useStore'

type Props = {
  item: Purchase
  buttonLabel: string
}
const PurchaseCard: React.FC<Props> = ({ item, buttonLabel }) => {
  const navigation = useNavigation<NavigationType>()
  const { literals } = useStore.getState()

  return (
    <Container style={shadow}>
      <Image
        image={item.images?.length > 0 ? item.images[0] : ''}
        favoriteButton
        shopId={item.id}
      />
      <Content>
        <ShopLogoTitle title={item.name} ellipsis />
        {item.offer && item.offer.max_purchases && (
          <>
            <Subtitle>{item.offer.title}</Subtitle>
            <Description>{item.offer.description}</Description>
            <Loyalty
              number={item.offer.user_purchases}
              maxNumber={item.offer.max_purchases}
            />
            {item.offer.user_purchases &&
              item.offer.user_purchases === item.offer.max_purchases && (
                <Description style={{ paddingBottom: 16 }}>
                  {literals[33]}
                </Description>
              )}
            <ButtonContainer>
              <ButtonRounded
                label={buttonLabel}
                onPress={() =>
                  navigation.navigate('RedeemOffer', { item: item })
                }
                disabled={
                  (item.offer.user_purchases || 0) < item.offer.max_purchases
                }
              />
            </ButtonContainer>
          </>
        )}
      </Content>
    </Container>
  )
}

export default PurchaseCard

const Container = styled.View`
  background-color: ${theme.colors.white};
  margin-bottom: ${theme.spacing[2]};
`
const Content = styled.View`
  padding: ${theme.spacing[3]};
`
const Subtitle = styled.Text`
  padding-top: ${theme.spacing[3]};
  padding-bottom: ${theme.spacing[2]};
  font-size: ${theme.fonts.size[18]};
  line-height: ${theme.fonts.height[22]};
  font-family: ${theme.fonts.notoSansSemiBold};
  color: ${theme.colors.black};
`
const Description = styled.Text`
  font-size: ${theme.fonts.size[16]};
  font-family: ${theme.fonts.notoSansRegular};
  line-height: ${theme.fonts.height[22]};
  color: ${theme.colors.black};
`
const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
`
