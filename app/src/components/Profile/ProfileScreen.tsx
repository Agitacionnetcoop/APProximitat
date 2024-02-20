import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'

import ScreenContainer from '../common/ScreenContainer'
import ButtonRounded from '../common/ButtonRounded'
import { useStore } from '../../store/useStore'
import { ProfileOptionsProps } from '../types'
import { Linking } from 'react-native'
import { OneSignal } from 'react-native-onesignal'

const ProfileScreen = ({ navigation }: ProfileOptionsProps) => {
  const { literals, user } = useStore.getState()
  const { setToken, setUser, setFavorites } = useStore()
  const [loading, setLoading] = useState(false)
  const [showID, setShowID] = useState(false)

  const handleLogout = () => {
    setLoading(true)
    setUser({})
    setToken('')
    setFavorites([])
    OneSignal.logout()

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginSignup', params: { formType: 'login' } }],
      })
      setLoading(false)
    }, 500)
  }

  const handleShowID = () => {
    if (!showID) {
      setShowID(true)
    }
  }

  useEffect(() => {
    if (showID) {
      setTimeout(() => {
        setShowID(false)
      }, 10000)
    }
  }, [showID])

  return (
    <ScreenContainer loadingContent={loading}>
      <OptionsContainer>
        <ButtonRounded
          label={literals[8]}
          onPress={() => navigation.navigate('PersonalInfo')}
          color={theme.colors.grayD9D9D9}
          labelColor={theme.colors.green}
          icon="profile"
        />
        <ButtonRounded
          label={literals[7]}
          onPress={() => navigation.navigate('Purchases')}
          color={theme.colors.grayD9D9D9}
          labelColor={theme.colors.green}
          icon="shop"
        />
        <ButtonRounded
          label={literals[6]}
          onPress={() => navigation.navigate('SavedShops')}
          color={theme.colors.grayD9D9D9}
          labelColor={theme.colors.green}
          icon="heart"
        />
        <ButtonRounded
          label={literals[67]}
          onPress={() =>
            Linking.openURL('https://approximitat.cat/?page_id=266')
          }
          color={theme.colors.grayD9D9D9}
          labelColor={theme.colors.green}
          icon="support"
        />
        <ButtonRounded
          label={showID ? `${user.public_id}` : literals[78]}
          onPress={() => handleShowID()}
          color={showID ? theme.colors.green : theme.colors.grayD9D9D9}
          labelColor={showID ? theme.colors.grayD9D9D9 : theme.colors.green}
          customContainerStyles={{ minHeight: 45 }}
        />
      </OptionsContainer>
      <LogoutContainer>
        <ButtonRounded label={literals[5]} onPress={() => handleLogout()} />
      </LogoutContainer>
      <InfoContainer>
        <Version>{literals[32]}</Version>
      </InfoContainer>
    </ScreenContainer>
  )
}

export default ProfileScreen

const OptionsContainer = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[8]};
  padding-horizontal: ${theme.spacing[5]};
  padding-vertical: ${theme.spacing[16]};
`
const LogoutContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const InfoContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${theme.spacing[20]};
`
const Version = styled.Text`
  font-family: ${theme.fonts.notoSansRegular};
  font-size: ${theme.fonts.size[16]};
  line-height: ${theme.fonts.height[22]};
`
