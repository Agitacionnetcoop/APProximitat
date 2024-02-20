/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
// import 'react-native-gesture-handler'
import React, { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AppNavigator from './components/Navigator'
import { getLiterals } from './services/data.services'

import { useNotifications, useStore } from './store/useStore'
import { translateAll } from './helpers/language'
import { checkNotifications, getFavorites } from './services/user.services'
import Loader from './components/common/Loader'
import { View, NativeModules, Platform } from 'react-native'
import { ErrorAlert } from './services/alerts'
import { ONESIGNAL_APP_ID } from '@env'
import { OneSignal } from 'react-native-onesignal'

if (__DEV__) {
  import('.././ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  )
}

const App = () => {
  const appState = useRef(AppState.currentState)
  const {
    setLiterals,
    setFilterOptions,
    token,
    setFavorites,
    setLanguage,
    language,
  } = useStore()
  const { literals, user } = useStore.getState()
  const { setNotifications } = useNotifications(({ setNotifications }) => ({
    setNotifications,
  }))
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getDeviceLanguage = () => {
    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier

    const deviceLanguageSplit = deviceLanguage
      .replace('-', ',')
      .replace('_', ',')
      .split(',')

    const formattedDeviceLanguage =
      deviceLanguageSplit.length > 1 ? deviceLanguageSplit[0] : deviceLanguage

    if (['ca', 'es'].includes(formattedDeviceLanguage)) {
      setLanguage(formattedDeviceLanguage)
    } else {
      setLanguage('ca')
    }
  }

  const initLiteralsAndSettings = async () => {
    setLoading(true)
    const response = await getLiterals()
    if (response) {
      if (response.message) {
        setError(response.message)
      } else if (Object.keys(response).length > 0) {
        const translatedLiterals = translateAll(response.literals)
        setLiterals(translatedLiterals)
        setFilterOptions({
          categories: response.categories,
          sustainability: response.sustainabilityTags,
        })
      }
    }
    setLoading(false)
  }

  const initUserFavorites = async () => {
    const userFavorites = await getFavorites()
    if (userFavorites) {
      setFavorites(userFavorites)
    }
  }

  const initNotifiactionService = () => {
    const hasNotificationsPermission = OneSignal.Notifications.hasPermission()
    if (user?.id) {
      OneSignal.login(`${user.id}`)
      if (hasNotificationsPermission) {
        OneSignal.User.addAlias('external_id', `${user.id}`)
      }
    }
  }

  const checkNewNotifications = async () => {
    if (user?.id) {
      const newNotifications = await checkNotifications(user.id)
      if (newNotifications) {
        setNotifications(newNotifications.unreadNumber)
      }
    }
  }

  useEffect(() => {
    OneSignal.setConsentRequired(Platform.OS === 'android' ? false : true)
    OneSignal.initialize(ONESIGNAL_APP_ID)
    getDeviceLanguage()
  }, [])

  useEffect(() => {
    const state = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!')
        initNotifiactionService()
        checkNewNotifications()
      } else {
        console.log('Init App')
        if (error) {
          ErrorAlert(error)
        } else if (literals && Object.keys(literals).length === 0) {
          initLiteralsAndSettings()
        }
      }

      appState.current = nextAppState
    })

    return () => {
      state.remove()
    }
  }, [literals, error, language])

  useEffect(() => {
    if (token) {
      initUserFavorites()
      checkNewNotifications()
    }
  }, [token])

  return (
    <SafeAreaProvider>
      {Object.keys(literals).length === 0 || loading ? (
        <View
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader />
        </View>
      ) : (
        <AppNavigator />
      )}
    </SafeAreaProvider>
  )
}

export default App
