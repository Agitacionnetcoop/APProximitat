import { Shop, ShopOffer } from './shop'

export type User = UserType | Record<string, never>

type UserType = {
  id: number
  public_id: string
  name: string
  email: string
  data: string
  active: boolean
}

export type SavedShop = Pick<
  Shop,
  'id' | 'name' | 'description' | 'email' | 'phone' | 'images'
> & {
  offer?: Pick<ShopOffer, 'id' | 'max_purchases' | 'user_purchases'>
}

export type Purchase = Pick<Shop, 'id' | 'name' | 'images'> & {
  offer?: Pick<
    ShopOffer,
    'id' | 'description' | 'max_purchases' | 'title' | 'user_purchases'
  >
}

export type Notification = {
  offer: Pick<ShopOffer, 'max_purchases' | 'user_purchases'>
} & {
  notiId: number
  shopId: number
  offerId: number
  name: string
  data: string
  images: string[]
  read: 0 | 1
}
