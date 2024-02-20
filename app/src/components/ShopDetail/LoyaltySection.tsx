import React from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'
import SectionTitle from '../common/SectionTitle'
import { ShopOffer } from '../types/shop'
import Loyalty from '../Purchases/Loyalty'

type Props = {
  offer: ShopOffer
  literals: Record<string, string>
}
const LoyaltySection = ({ offer, literals }: Props) => {
  return (
    <Container>
      {/* <SectionTitle
        text={offer.max_purchases > 0 ? literals[11] : literals[18]}
      /> */}
      <SectionTitle text={offer.title} />
      <Text>{offer.description}</Text>
      <LoyaltyContainer show={offer.max_purchases > 0}>
        {offer.max_purchases > 0 ? (
          <Loyalty
            number={offer.user_purchases}
            maxNumber={offer.max_purchases}
            color={theme.colors.turquoise}
          />
        ) : null}
      </LoyaltyContainer>
    </Container>
  )
}

const Container = styled.View`
  padding-top: ${theme.spacing['2.5']};
  padding-horizontal: ${theme.spacing[5]};
`
const Text = styled.Text`
  padding-top: ${theme.spacing[4]};
  line-height: ${theme.fonts.height[22]};
  font-size: ${theme.fonts.size[16]};
  font-family: ${theme.fonts.notoSansRegular};
  color: ${theme.colors.black};
`
const LoyaltyContainer = styled.View<{ show: boolean }>`
  padding-bottom: ${({ show }) => (show ? '0px' : theme.spacing[4])};
`

export default LoyaltySection
