import React from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'

import ScreenContainer from '../common/ScreenContainer'
import { useStore } from '../../store/useStore'
import { RedeemOfferProps } from '../types'
import QRCode from 'react-qr-code'
import { Dimensions } from 'react-native'

const RedeemOfferScreen = ({ navigation, route }: RedeemOfferProps) => {
  const { item } = route.params
  const { user, literals } = useStore.getState()

  const SCREEN_WIDTH = Dimensions.get('window').width

  return (
    <ScreenContainer>
      <Description>
        {literals[79]} <Bold>{item.name}</Bold> {literals[80]}:{' '}
        <Bold>{item.offer?.title}</Bold>
      </Description>
      <Description>{literals[81]}:</Description>
      <Code>{user.public_id}</Code>
      {item.offer?.id && (
        <QRContainer>
          <QRCode
            size={SCREEN_WIDTH - 62}
            value={`https://panel.approximitat.cat/qr/${user.id}/${item.offer?.id}`}
          />
        </QRContainer>
      )}
    </ScreenContainer>
  )
}

export default RedeemOfferScreen

const Code = styled.Text`
  font-family: ${theme.fonts.notoSansBold};
  color: ${theme.colors.black};
  font-size: ${theme.fonts.size[32]};
  line-height: ${theme.fonts.height[34]};
  text-align: center;
  padding-top: ${theme.spacing[6]};
`
const Bold = styled.Text`
  font-size: ${theme.fonts.size[20]};
  line-height: ${theme.fonts.height[24]};
  font-family: ${theme.fonts.notoSansSemiBold};
  color: ${theme.colors.black};
  text-align: center;
`
const Description = styled.Text`
  font-size: ${theme.fonts.size[20]};
  font-family: ${theme.fonts.notoSansRegular};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
  text-align: center;
  padding-top: ${theme.spacing[4]};
`
const QRContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-vertical: ${theme.spacing[8]};
  padding: ${theme.spacing[2]};
  border: solid ${theme.colors.green} 3px;
  background-color: ${theme.colors.white};
`
