import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { shadow, theme } from '../../settings/theme'
import { NavigationType, SavedShop } from '../types'

import Image from '../common/Image'
import RRSSS from '../common/RRSS'
import ShopLogoTitle from '../common/ShopLogoTitle'
import { useNavigation } from '@react-navigation/native'

type Props = {
  item: SavedShop
  subtitle: string
}

const SavedShopCard: React.FC<Props> = ({ item, subtitle }) => {
  const navigation = useNavigation<NavigationType>()

  const formattedPhone = item?.phone.includes(' ')
    ? item?.phone.slice(-12)
    : item?.phone.slice(-9)
  const formattedPhoneNoSpaces = formattedPhone?.split(' ').join('')

  const formattedEmail =
    item?.email && item?.email !== 'sinmail@googleplaces.com'
      ? item.email
      : undefined

  return (
    <Container
      style={shadow}
      onPress={() => navigation.navigate('ShopDetail', { id: item.id })}
    >
      <Image
        image={item.images?.length > 0 ? item.images[0] : ''}
        width={118}
      />
      <Content>
        <Fragment>
          <ShopLogoTitle
            title={item.name}
            fontSize={16}
            lineHeight={20}
            ellipsis
          />
          {item.offer && item.offer.max_purchases && (
            <PurchasesContainer>
              <Label>
                {subtitle}:{' '}
                <Bold>{`${item.offer.user_purchases || 0}/${
                  item.offer.max_purchases
                }`}</Bold>
              </Label>
            </PurchasesContainer>
          )}
          <Description numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </Description>
        </Fragment>
        <RRSSS
          containerStyle={{ paddingTop: 16 }}
          phone={formattedPhoneNoSpaces}
          email={formattedEmail}
        />
      </Content>
    </Container>
  )
}

export default SavedShopCard

const Container = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  background-color: ${theme.colors.white};
  margin-bottom: ${theme.spacing[2]};
`
const Content = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: ${theme.spacing[3]};
`
const PurchasesContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding-top: ${theme.spacing[2]};
`
const Label = styled.Text`
  font-size: ${theme.fonts.size[14]};
  font-family: ${theme.fonts.notoSansRegular};
  line-height: ${theme.fonts.height[20]};
  color: ${theme.colors.black};
`
const Bold = styled.Text`
  font-family: ${theme.fonts.notoSansSemiBold};
`
const Description = styled.Text`
  padding-top: ${theme.spacing[4]};
  font-size: ${theme.fonts.size[14]};
  font-family: ${theme.fonts.notoSansRegular};
  line-height: ${theme.fonts.height[20]};
  color: ${theme.colors.black};
`
