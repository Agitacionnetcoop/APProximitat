import React, { useEffect } from 'react'
import { Text } from 'react-native'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  navTheme,
  tabBarLabelStyle,
  tabBarStyle,
  theme,
} from '../../settings/theme'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from '../common/Icon'
import resolver, { Icons } from '../../helpers/resolver'
import Header from './Header'
import AllShopsScreen from '../AllShops'
import ShopsCategoryScreen from '../ShopsCategory'
import {
  HomeTabStackParamList,
  ActivityTabStackParamList,
  ProfileTabStackParamList,
  MapTabStackParamList,
  RootStackParamList,
  TabStackParamList,
} from '../types'
import ShopDetailScreen from '../ShopDetail'
import ActivitiesScreen from '../Activities'
import ActivityDetailScreen from '../ActivityDetail'
import ProfileScreen from '../Profile'
import PersonalInfoScreen from '../PersonalInfo'
import PurchasesScreen from '../Purchases'
import SavedShopsScreen from '../SavedShops'
import NotificationsScreen from '../Notifications'
import FiltersScreen from '../Filters'
import SearchResultScreen from '../Search'
import OnboardingScreen from '../Onboarding'
import MapScreen from '../Map'
import { useStore } from '../../store/useStore'
import LoginSignupScreen from '../LoginSignup/LoginSignupScreen'
import AuthenticationScreen from '../Authentication/AuthenticationScreen'
import RedeemOfferScreen from '../RedeemOffer/RedeemOfferScreen'

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['approximitat://', 'http://approximitat', 'https://approximitat'],
  config: {
    screens: {
      MainTab: {
        screens: {
          Profile: {
            screens: {
              Authentication: {
                path: 'auth',
              },
            },
          },
        },
      },
    },
  },
}

const ShopsStack = createNativeStackNavigator<HomeTabStackParamList>()
const MapStack = createNativeStackNavigator<MapTabStackParamList>()
const ActivitiesStack = createNativeStackNavigator<ActivityTabStackParamList>()
const ProfileStack = createNativeStackNavigator<ProfileTabStackParamList>()
const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabStackParamList>()

const Shops = () => {
  return (
    <ShopsStack.Navigator
      initialRouteName={'AllShops'}
      screenOptions={({ route }) => ({
        header: () => (
          <Header
            backButton={route.name !== 'AllShops'}
            shareButton={
              ['ActivityDetail', 'ShopDetail'].includes(route.name) &&
              (route.params as { id: number })?.id
                ? (route.params as { id: number })?.id
                : undefined
            }
            shareButtonType={
              route.name === 'ActivityDetail' ? 'activity' : 'shop'
            }
          />
        ),
      })}
    >
      <ShopsStack.Screen name="AllShops" component={AllShopsScreen} />
      <ShopsStack.Screen name="ShopsCategory" component={ShopsCategoryScreen} />
      <ShopsStack.Screen name="ShopDetail" component={ShopDetailScreen} />
      <ShopsStack.Screen name="Search" component={SearchResultScreen} />
      <ShopsStack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
      />
      <ShopsStack.Screen name="Purchases" component={PurchasesScreen} />
    </ShopsStack.Navigator>
  )
}
const Map = () => {
  return (
    <MapStack.Navigator
      initialRouteName={'ShopsMap'}
      screenOptions={({ route }) => ({
        header: () => (
          <Header
            backButton={route.name !== 'ShopsMap'}
            shareButton={
              route.name === 'ShopDetail' &&
              (route.params as { id: number })?.id
                ? (route.params as { id: number })?.id
                : undefined
            }
            shareButtonType="shop"
          />
        ),
      })}
    >
      <MapStack.Screen
        name="ShopsMap"
        initialParams={{ id: null, lat: undefined, lng: undefined }}
        component={MapScreen}
      />
      <MapStack.Screen name="ShopDetail" component={ShopDetailScreen} />
      <MapStack.Screen name="Search" component={SearchResultScreen} />
      <MapStack.Screen name="Purchases" component={PurchasesScreen} />
    </MapStack.Navigator>
  )
}
const Activities = () => {
  return (
    <ActivitiesStack.Navigator
      initialRouteName={'AllActivities'}
      screenOptions={({ route }) => ({
        header: () => (
          <Header
            backButton={route.name !== 'AllActivities'}
            shareButton={
              ['ActivityDetail', 'ShopDetail'].includes(route.name) &&
              route.params?.id
                ? route.params.id
                : undefined
            }
            shareButtonType={
              route.name === 'ActivityDetail' ? 'activity' : 'shop'
            }
            searchBar={false}
            notificationsAndFilters={false}
          />
        ),
      })}
    >
      <ActivitiesStack.Screen
        name="AllActivities"
        component={ActivitiesScreen}
      />
      <ActivitiesStack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
      />
      <ActivitiesStack.Screen name="ShopDetail" component={ShopDetailScreen} />
    </ActivitiesStack.Navigator>
  )
}
const Profile = () => {
  const { token } = useStore.getState()
  const initScreen = token.length > 0 ? 'ProfileOptions' : 'LoginSignup'

  return (
    <ProfileStack.Navigator
      initialRouteName={initScreen}
      screenOptions={({ route }) => ({
        header: () => (
          <Header
            searchBar={false}
            notificationsAndFilters={false}
            backButton={route.name !== 'ProfileOptions'}
            shareButton={
              route.name === 'ShopDetail' &&
              (route.params as { id: number })?.id
                ? (route.params as { id: number })?.id
                : undefined
            }
            shareButtonType="shop"
          />
        ),
      })}
    >
      <ProfileStack.Screen
        name="LoginSignup"
        component={LoginSignupScreen}
        options={{ headerShown: false }}
        initialParams={{ formType: 'signup' }}
      />
      <ProfileStack.Screen
        name="Authentication"
        component={AuthenticationScreen}
        options={{ headerShown: false }}
        initialParams={{ code: undefined }}
      />
      <ProfileStack.Screen name="ProfileOptions" component={ProfileScreen} />
      <ProfileStack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <ProfileStack.Screen name="Purchases" component={PurchasesScreen} />
      <ProfileStack.Screen name="SavedShops" component={SavedShopsScreen} />
      <ProfileStack.Screen name="ShopDetail" component={ShopDetailScreen} />
      <ProfileStack.Screen name="RedeemOffer" component={RedeemOfferScreen} />
    </ProfileStack.Navigator>
  )
}

const MainTab = () => {
  const { literals } = useStore.getState()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const focusColor = (focused: boolean): string =>
          focused ? theme.colors.primary : theme.colors.black

        return {
          tabBarIcon: ({ focused }) => {
            let iconName: Icons
            if (resolver.icons[route.name.toLowerCase()])
              iconName = (route.name.toLowerCase() as Icons) || 'not_found'
            else iconName = 'not_found'
            // You can return any component that you like here!
            return (
              <Icon
                icon={iconName}
                color={focusColor(focused)}
                height={25}
                calculateWidth={true}
              />
            )
          },
          tabBarLabel: ({ focused, children }) => {
            return (
              <Text
                style={{
                  color: focusColor(focused),
                  ...tabBarLabelStyle,
                }}
              >
                {children}
              </Text>
            )
          },
          tabBarStyle: { ...tabBarStyle },
          headerShown: false,
        }
      }}
    >
      <Stack.Screen
        name="Home"
        component={Shops}
        options={{ title: literals[1] }}
      />
      <Stack.Screen
        name="Discover"
        component={Map}
        options={{ title: literals[2] }}
      />
      <Stack.Screen
        name="Activities"
        component={Activities}
        options={{ title: literals[3] }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: literals[4] }}
      />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { appOpened } = useStore()
  const { firstTimeOpeningApp } = useStore.getState()

  const initScreen = firstTimeOpeningApp ? 'Welcome' : 'MainTab'

  useEffect(() => {
    if (firstTimeOpeningApp) {
      setTimeout(() => {
        appOpened()
      }, 1500)
    }
  }, [])

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <Stack.Navigator
        initialRouteName={initScreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MainTab" component={MainTab} />
        <Stack.Screen
          name="Welcome"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Filters"
          component={FiltersScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
