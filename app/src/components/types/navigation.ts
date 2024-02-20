import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { Category } from './shop'
import { ParamListBase } from '@react-navigation/native'
import { Purchase } from './user'

export type NavigationType = NativeStackNavigationProp<ParamListBase>

export type RootStackParamList = TabStackParamList & {
  MainTab: undefined
  Welcome: undefined
  Notifications: undefined
  Filters: { firstConfig?: boolean }
}

export type TabStackParamList = {
  Home: HomeTabStackParamList
  Discover: MapTabStackParamList
  Activities: ActivityTabStackParamList
  Profile: ProfileTabStackParamList
}

export type HomeTabStackParamList = {
  AllShops: undefined
  ShopsCategory: { item: Category; type: 'category' | 'tag' | 'sustainability' }
  ShopDetail: { id: number }
  Search: { searchValue: string }
  ActivityDetail: { id: number }
  Purchases: undefined
}

export type MapTabStackParamList = {
  ShopsMap: { id?: number | null; lat?: number; lng?: number }
  ShopDetail: { id: number }
  Search: { searchValue: string }
  Purchases: undefined
}

export type ActivityTabStackParamList = {
  AllActivities: undefined
  ActivityDetail: { id: number }
  ShopDetail: { id: number }
}

export type ProfileTabStackParamList = {
  LoginSignup: { formType: 'login' | 'signup' }
  Authentication: { code?: string }
  ProfileOptions: undefined
  PersonalInfo: undefined
  Purchases: undefined
  SavedShops: undefined
  ShopDetail: { id: number }
  RedeemOffer: { item: Purchase }
}

// Root Stack
export type WelcomeProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>

export type NotificationsProps = NativeStackScreenProps<
  RootStackParamList,
  'Notifications'
>
export type FiltersProps = NativeStackScreenProps<RootStackParamList, 'Filters'>

// Home Stack
export type AllShopsProps = NativeStackScreenProps<
  HomeTabStackParamList,
  'AllShops'
>
export type ShopsCategoryProps = NativeStackScreenProps<
  HomeTabStackParamList,
  'ShopsCategory'
>
export type ShopDetailProps = NativeStackScreenProps<
  HomeTabStackParamList,
  'ShopDetail'
>
export type SearchResultProps = NativeStackScreenProps<
  HomeTabStackParamList,
  'Search'
>

// Map Stack
export type ShopsMapProps = NativeStackScreenProps<
  MapTabStackParamList,
  'ShopsMap'
>

// Activity Stack
export type AllActivitiesProps = NativeStackScreenProps<
  ActivityTabStackParamList,
  'AllActivities'
>
export type ActivityDetailProps = NativeStackScreenProps<
  ActivityTabStackParamList,
  'ActivityDetail'
>

// Profile Stack
export type LoginSignupProps = NativeStackScreenProps<
  ProfileTabStackParamList,
  'LoginSignup'
>
export type AuthenticationProps = NativeStackScreenProps<
  ProfileTabStackParamList,
  'Authentication'
>
export type ProfileOptionsProps = NativeStackScreenProps<
  ProfileTabStackParamList,
  'ProfileOptions'
>
export type PersonalInfoProps = NativeStackScreenProps<
  ProfileTabStackParamList,
  'PersonalInfo'
>
export type PurchasesProps = NativeStackScreenProps<
  ProfileTabStackParamList,
  'Purchases'
>
export type SavedShopsProps = NativeStackScreenProps<
  ProfileTabStackParamList,
  'SavedShops'
>
export type RedeemOfferProps = NativeStackScreenProps<
  ProfileTabStackParamList,
  'RedeemOffer'
>
