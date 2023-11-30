import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'
import { Activity, ActivityDetailProps } from '../types'

import ScreenContainer from '../common/ScreenContainer'
import Image from '../common/Image'
import { fromDateToDate } from '../../helpers/fromDateToDate'
import { getActivity } from '../../services/data.services'
import InfoRow from '../common/InfoRow'
import SectionTitle from '../common/SectionTitle'
import ShopCard from '../AllShops/ShopCard'
import { useStore } from '../../store/useStore'

const ActivityDetailScreen = ({ navigation, route }: ActivityDetailProps) => {
  const { literals } = useStore.getState()
  const { id } = route.params
  const [data, setData] = useState<Activity>()

  const dateHour = data
    ? fromDateToDate(data.date_initial, data.date_final)
    : null

  const loadData = async () => {
    const response = await getActivity({ id })
    if (response) {
      setData(response)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <ScreenContainer paddingHorizontal={0} backgroundColor={theme.colors.white}>
      <Image image={data?.image || ''} height={156} />
      <ContentContainer>
        {dateHour?.date && <Date>{dateHour.date}</Date>}
        <Title>{data?.title}</Title>
        {dateHour?.date && <InfoRow icon="calendar" text={dateHour.date} />}
        {(data?.via || data?.num || data?.cp) && (
          <InfoRow
            icon={'location'}
            text={`${data?.via} ${data?.num}, ${data?.cp}`}
          />
        )}
        {data?.email && <InfoRow icon="email_icon" text={data?.email} />}
        {data?.phone && <InfoRow icon="phone" text={data?.phone} />}
        {dateHour?.hour && <InfoRow icon="clock" text={dateHour.hour} />}
        <Description>{data?.body}</Description>
        {data?.shop && data?.shop.id && (
          <ShopContainer>
            <SectionTitle text={`${literals[87]} ${data.shop.name}`} />
            <ShopCard
              onPress={() =>
                navigation.navigate('ShopDetail', { id: data.shop.id })
              }
              item={data.shop}
            />
          </ShopContainer>
        )}
      </ContentContainer>
    </ScreenContainer>
  )
}

const ContentContainer = styled.View`
  padding-horizontal: ${theme.spacing[5]};
  padding-vertical: ${theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`
const ShopContainer = styled.View`
  gap: ${theme.spacing[6]};
`
const Date = styled.Text`
  font-size: ${theme.fonts.size[16]};
  line-height: ${theme.fonts.height[20]};
  font-family: ${theme.fonts.merriweatherBold};
  color: ${theme.colors.black};
`
const Title = styled.Text`
  font-size: ${theme.fonts.size[18]};
  line-height: ${theme.fonts.height[22]};
  font-family: ${theme.fonts.merriweatherBlack};
  color: ${theme.colors.black};
  padding-bottom: ${theme.spacing[1]};
`

const Description = styled.Text`
  line-height: ${theme.fonts.height[20]};
  font-size: ${theme.fonts.size[14]};
  font-family: ${theme.fonts.notoSansRegular};
  color: ${theme.colors.black};
  padding-bottom: ${theme.spacing[4]};
`
export default ActivityDetailScreen
