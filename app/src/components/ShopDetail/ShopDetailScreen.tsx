import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { shadow, theme } from '../../settings/theme'
import { NavigationType, Shop, ShopDetailProps } from '../types'
import ShopTags from '../AllShops/ShopTags'
import InfoRow from '../common/InfoRow'
import { lang } from '../../helpers/language'
import ServicesSection from './ServicesSection'
import ScheduleSection from './ScheduleSection'
import LoyaltySection from './LoyaltySection'
import ScreenContainer from '../common/ScreenContainer'
import ButtonRounded from '../common/ButtonRounded'
import ImageSlider from '../common/ImageSlider'
import ShopLogoTitle from '../common/ShopLogoTitle'
import RRSSS from '../common/RRSS'
import { getShop } from '../../services/data.services'
import { useStore } from '../../store/useStore'
import { Linking, TouchableOpacity, View } from 'react-native'
import { ErrorAlert } from '../../services/alerts'
import { ShopStatus, getShopOpenStatus } from '../../helpers/shopOpenStatus'
import ActivitiesSection from './ActivitiesSection'
import { useNavigation } from '@react-navigation/native'

const ShopDetailScreen = ({ route }: ShopDetailProps) => {
  const navigation = useNavigation<NavigationType>()
  const { id } = route.params
  const { literals, user } = useStore()
  const [data, setData] = useState<Shop | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [shopStatus, setShopStatus] = useState<ShopStatus>()

  const loadData = async (id: number) => {
    setLoading(true)
    const response = await getShop({ id, userId: user?.id || null })
    if (response) {
      const status = getShopOpenStatus(literals, response.schedule)
      setShopStatus(status)
      setData(response)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData(id)
  }, [id])

  const formattedPhone = data?.phone.includes(' ')
    ? data?.phone.slice(-12)
    : data?.phone.slice(-9)
  const formattedPhoneNoSpaces = formattedPhone?.split(' ').join('')

  const formattedEmail =
    data?.email && data?.email !== 'sinmail@googleplaces.com'
      ? data.email
      : undefined

  return (
    <ScreenContainer
      paddingHorizontal={0}
      stickyHeaderIndices={[2]}
      backgroundColor={theme.colors.white}
      loadingContent={loading}
    >
      <ImageSlider items={data?.images || []} shopId={id} />
      <View>
        <RRSSContainer style={shadow}>
          {formattedPhone && formattedPhoneNoSpaces ? (
            <ButtonRounded
              onPress={() => {
                Linking.openURL(`tel:${formattedPhone}`)
                  .then()
                  .catch((err: any) => {
                    return ErrorAlert(err.error)
                  })
              }}
              label={formattedPhone}
            />
          ) : (
            <View />
          )}
          {(formattedPhoneNoSpaces || formattedEmail || data?.canals) && (
            <RRSSS
              phone={formattedPhoneNoSpaces}
              email={formattedEmail}
              channels={data?.canals}
            />
          )}
        </RRSSContainer>
      </View>
      <Content>
        {data?.name && <ShopLogoTitle title={data?.name} />}
        <Info>
          {(data?.via || data?.num || data?.cp) && (
            <InfoRow
              icon={'location'}
              text={`${data?.via || ''} ${data?.num || ''}, ${data?.cp || ''}`}
              onPress={() =>
                navigation.navigate('MainTab', {
                  screen: 'Discover',
                  params: {
                    screen: 'ShopsMap',
                    params: {
                      id: data?.id || undefined,
                      lat: data?.coordenates.latitude || undefined,
                      lng: data?.coordenates.longitude || undefined,
                    },
                  },
                })
              }
            />
          )}
          <InfoRow
            icon={'category'}
            text={`${lang(literals[38])}: ${lang(data?.catName)}`}
          />
          {data?.schedule && shopStatus && (
            <InfoRow
              icon={'clock'}
              status={shopStatus.status}
              statusText={shopStatus.statusText}
              text={shopStatus.text || ''}
            />
          )}
          {data?.accessible === 1 && (
            <InfoRow icon={'red_mob'} text={lang(literals[46])} />
          )}
        </Info>
        <Description>{data?.description}</Description>
        <ShopTags
          tags={data?.tags || []}
          sustainabilityTags={data?.sustainabilityTags || []}
        />
      </Content>
      {data?.offers &&
        data.offers.length > 0 &&
        data.offers.map(offer => {
          if (Object.keys(offer).length === 0) return null
          return (
            <LoyaltySection key={offer.id} offer={offer} literals={literals} />
          )
        })}
      {data?.schedule && data.schedule.length > 0 && (
        <ScheduleSection schedule={data?.schedule} literals={literals} />
      )}
      {data?.services && data.services.length > 0 && (
        <ServicesSection services={data?.services} literals={literals} />
      )}
      {data?.name && data?.activities && data.activities.length > 0 && (
        <ActivitiesSection
          shopName={data.name}
          activities={data.activities}
          literals={literals}
        />
      )}
      <IDContainer>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://panel.approximitat.cat/')}
        >
          <IDText>ID: {id}</IDText>
        </TouchableOpacity>
      </IDContainer>
    </ScreenContainer>
  )
}

const RRSSContainer = styled.View`
  flex: 1;
  flex-direction: row;
  padding-horizontal: ${theme.spacing[5]};
  padding-vertical: ${theme.spacing[2]};
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.colors.white};
  min-height: 62px;
`
const Content = styled.View`
  padding-horizontal: ${theme.spacing[5]};
  padding-top: ${theme.spacing[3]};
  padding-bottom: ${theme.spacing[5]};
  display: flex;
  flex-direction: column;
`
const Info = styled.View`
  margin-top: ${theme.spacing[2]};
  display: flex;
  flex-direction: column;
`
const Description = styled.Text`
  padding-bottom: ${theme.spacing[5]};
  padding-top: ${theme.spacing[4]};
  line-height: ${theme.fonts.height[22]};
  font-size: ${theme.fonts.size[16]};
  font-family: ${theme.fonts.notoSansRegular};
  color: ${theme.colors.black};
`
const IDContainer = styled.View`
  margin-top: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const IDText = styled.Text`
  color: ${theme.colors.black};
  font-size: ${theme.fonts.size[14]};
`
export default ShopDetailScreen
