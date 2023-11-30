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
  offer?: Pick<
  ShopOffer,
  | 'id'
  | 'max_purchases'
  | 'user_purchases'
  >
}

export type Purchase = Pick<
Shop,
| 'id'
| 'name'
| 'images'
>  & {
  offer?: Pick<
  ShopOffer,
  | 'id'
  | 'description'
  | 'max_purchases'
  | 'title'
  | 'user_purchases'
  >
}

export type Notification = Pick<
Shop,
| 'id'
| 'name'
| 'images'
>  & {
  offer?: Pick<
  ShopOffer,
  | 'id'
  | 'max_purchases'
  | 'user_purchases'
  >
} & {
  date: string
}
