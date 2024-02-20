import React, { Fragment, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { tabBarHeight, theme } from '../../settings/theme'
import { Dimensions, ScrollView } from 'react-native'

import OverlayContainer from '../common/OverlayContainer'
import NotificationCard from './NotificationCard'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNotifications, useStore } from '../../store/useStore'
import { NavigationType, Notification, NotificationsProps } from '../types'
import { lang } from '../../helpers/language'
import {
  checkNotifications,
  getNotifications,
  readNotifications,
} from '../../services/user.services'
import Loader from '../common/Loader'
import { useNavigation } from '@react-navigation/native'

const NotificationsScreen = ({}: NotificationsProps) => {
  const navigation = useNavigation<NavigationType>()
  const { literals, token, user } = useStore.getState()
  const { setNotifications } = useNotifications(({ setNotifications }) => ({
    setNotifications,
  }))
  const insets = useSafeAreaInsets()
  const [data, setData] = useState<Notification[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [readItems, setReadItems] = useState<Notification[]>([])
  const [unreadItems, setUnreadItems] = useState<Notification[]>([])

  const SCREEN_HEIGHT =
    (Dimensions.get('window').height -
      tabBarHeight -
      insets.top -
      insets.bottom) *
    0.8

  const loadData = async () => {
    setLoading(true)
    const response = await getNotifications()
    if (response) {
      setData(response)
    }
    setLoading(false)
  }

  const handleReadNotification = async () => {
    const ids = unreadItems.map(i => i.notiId)
    if (ids.length > 0) {
      const response = await readNotifications(ids)
      if (response) {
        const update = await checkNotifications(user.id)
        if (update) {
          setNotifications(update.unreadNumber)
          navigation.goBack()
        }
      }
    } else {
      navigation.goBack()
    }
  }

  useEffect(() => {
    if (token?.length > 0) {
      loadData()
    } else {
      navigation.navigate('MainTab', {
        screen: 'Profile',
        params: {
          screen: 'LoginSignup',
          params: {
            formType: 'signup',
          },
        },
      })
    }
  }, [token])

  useEffect(() => {
    const unread = [...data].filter(i => i.read === 0)
    const read = [...data].filter(i => i.read === 1)
    setUnreadItems(unread)
    setReadItems(read)
  }, [data])

  return (
    <OverlayContainer onClose={() => handleReadNotification()}>
      {loading ? (
        <Loader fullScreen />
      ) : (
        <>
          <Title>{literals[28]}</Title>
          <ScrollView
            style={{
              marginBottom: tabBarHeight + insets.bottom,
            }}
          >
            <>
              {data.length === 0 ? (
                <EmptyContainer height={SCREEN_HEIGHT}>
                  <EmptyMessage>{literals[69]}</EmptyMessage>
                </EmptyContainer>
              ) : (
                <>
                  <Content>
                    {unreadItems.length === 0 ? (
                      <EmptyContainer height={60}>
                        <EmptyMessage>{literals[69]}</EmptyMessage>
                      </EmptyContainer>
                    ) : (
                      unreadItems.map((item, index) => {
                        return (
                          <Fragment key={item.notiId}>
                            {index !== 0 && <ItemSeparator />}
                            <Description>
                              {`${literals[29]} `}
                              <Bold>{item.name}</Bold>
                              {` ${literals[30]}`}
                            </Description>
                            <NotificationCard item={item} literals={literals} />
                          </Fragment>
                        )
                      })
                    )}
                  </Content>
                  <Separator />
                  <Content>
                    <Subtitle>{lang(literals[41])}</Subtitle>
                    {readItems.length === 0 ? (
                      <EmptyContainer height={60}>
                        <EmptyMessage>{literals[69]}</EmptyMessage>
                      </EmptyContainer>
                    ) : (
                      readItems.map(item => {
                        return (
                          <NotificationCard
                            key={item.notiId}
                            item={item}
                            literals={literals}
                          />
                        )
                      })
                    )}
                  </Content>
                </>
              )}
            </>
          </ScrollView>
        </>
      )}
    </OverlayContainer>
  )
}

export default NotificationsScreen

const Title = styled.Text`
  font-family: ${theme.fonts.notoSansBold};
  font-size: ${theme.fonts.size[24]};
  line-height: ${theme.fonts.height[32]};
  padding-horizontal: ${theme.spacing[5]};
  padding-bottom: ${theme.spacing[3]};
  color: ${theme.colors.black};
`
const Content = styled.View`
  padding-horizontal: ${theme.spacing[5]};
`
const Description = styled.Text`
  font-family: ${theme.fonts.notoSansRegular};
  font-size: ${theme.fonts.size[18]};
  line-height: ${theme.fonts.height[24]};
  padding-bottom: ${theme.spacing[3]};
  color: ${theme.colors.black};
`
const Subtitle = styled.Text`
  font-family: ${theme.fonts.notoSansSemiBold};
  font-size: ${theme.fonts.size[20]};
  line-height: ${theme.fonts.height[28]};
  padding-bottom: ${theme.spacing[2]};
  color: ${theme.colors.black};
`
const Bold = styled.Text`
  font-family: ${theme.fonts.notoSansSemiBold};
`
const Separator = styled.View`
  background-color: ${theme.colors.grayB0B0B0};
  height: 1px;
  width: 100%;
  margin-vertical: ${theme.spacing[3]};
`
const ItemSeparator = styled.View`
  background-color: ${theme.colors.grayD9D9D9};
  height: 1px;
  width: 100%;
  margin-vertical: ${theme.spacing[2]};
`
const EmptyContainer = styled.View<{ height: number }>`
  height: ${({ height }) => height}px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const EmptyMessage = styled.Text`
  font-family: ${theme.fonts.notoSansRegular};
  color: ${theme.colors.gray949494};
`
