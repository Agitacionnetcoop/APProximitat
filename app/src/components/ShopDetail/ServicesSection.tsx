import React from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'
import SectionTitle from '../common/SectionTitle'
import { Service } from '../types/shop'
import { useStore } from '../../store/useStore'

const formatPrice = (price: number) => {
  const language = useStore.getState().language
  const formattedPrice = new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
  return formattedPrice
}

type Props = {
  services: Service[]
  literals: Record<string, string>
}
const ServicesSection = ({ services, literals }: Props) => {
  return (
    <Container>
      <SectionTitle text={literals[20]} />
      {services.map(service => (
        <RowContainer key={service.title}>
          <ServiceTitle>{service.title}</ServiceTitle>
          <Price>{formatPrice(service.price)}</Price>
        </RowContainer>
      ))}
    </Container>
  )
}

const Container = styled.View`
  padding-top: ${theme.spacing['2.5']};
  padding-horizontal: ${theme.spacing[5]};
  padding-bottom: ${theme.spacing[10]};
`
const RowContainer = styled.View`
  flex-direction: row;
  padding-top: ${theme.spacing[5]};
  align-items: center;
  justify-content: space-between;
`
const ServiceTitle = styled.Text`
  line-height: ${theme.fonts.height[22]};
  font-size: ${theme.fonts.size[16]};
  font-family: ${theme.fonts.notoSansMedium};
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 0;
  color: ${theme.colors.black};
`
const Price = styled.Text`
  line-height: ${theme.fonts.height[22]};
  font-size: ${theme.fonts.size[16]};
  font-family: ${theme.fonts.notoSansRegular};
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  color: ${theme.colors.black};
`

export default ServicesSection
