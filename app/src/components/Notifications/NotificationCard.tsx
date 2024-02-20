import React, { Fragment } from 'react'
import styled from 'styled-components/native'

import { shadow, theme } from '../../settings/theme'
import ShopLogoTitle from '../common/ShopLogoTitle'
import Image from '../common/Image'
import ButtonRounded from '../common/ButtonRounded'
import { useNavigation } from '@react-navigation/native'
import { NavigationType, Notification } from '../types'

const NotificationCard = ({
  item,
  literals,
}: {
  item: Notification
  literals: Record<string, string>
}) => {
  const navigation = useNavigation<NavigationType>()

  return (
    <Container style={shadow}>
      <Image
        image={item.images?.length > 0 ? item.images[0] : ''}
        width={118}
        height="100%"
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
                {literals[10]}:{' '}
                <Bold>{`${item.offer.user_purchases || 0}/${
                  item.offer.max_purchases
                }`}</Bold>
              </Label>
            </PurchasesContainer>
          )}
        </Fragment>
        <ButtonContainer>
          <ButtonRounded
            label={literals[31]}
            onPress={() => navigation.navigate('Purchases')}
          />
        </ButtonContainer>
      </Content>
    </Container>
  )
}

export default NotificationCard

const Container = styled.View`
  display: flex;
  flex-direction: row;
  background-color: ${theme.colors.white};
  margin-bottom: ${theme.spacing[4]};
`
const Content = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: ${theme.spacing[4]};
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
const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-top: ${theme.spacing[4]};
`
