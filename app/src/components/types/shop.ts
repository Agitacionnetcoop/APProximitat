import { Activity } from './activity'
import { Schedule, TagItem, TranslatableText } from './common'

export type Shop = {
  catName?: string
  catId?: number
  id: number
  name: string
  description: string
  via: string
  num: string
  email: string
  cp: string
  phone: string
  coordenates: {
    latitude: number
    longitude: number
  }
  schedule: Schedule
  images: string[]
  tags: TagItem[]
  sustainabilityTags: TagItem[]
  web: string
  services: Service[]
  offer?: ShopOffer
  offers: ShopOffer[]
  accessible: 0 | 1
  canals: Channel[]
  activities: Activity[]
}

export type ShopSummary = Pick<
  Shop,
  | 'catName'
  | 'catId'
  | 'id'
  | 'name'
  | 'description'
  | 'tags'
  | 'sustainabilityTags'
  | 'images'
>

export type ShopOffer = {
  id:  number
  title: string
  description: string
  max_purchases: number
  user_purchases?: number
}

export type Service = {
  id: string
  title: string
  price: number
}

export type Category = {
  id: number
  name: TranslatableText
  shops: ShopSummary[]
}

export type Channel = {
  icon: string,
  id: number,
  name: string,
  value: string,
}
