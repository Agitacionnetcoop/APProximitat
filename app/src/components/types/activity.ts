import { TagItem } from './common'
import { ShopSummary } from './shop'

export type Activities = {
  activities: Activity[]
  tags: TagItem[]
}

export type Activity = {
  id: number
  title: string
  body: string
  image: string
  date_initial: string
  date_final: string
  via: string
  num: string
  cp: string
  email: string
  phone: string
  tags: TagItem[]
  shop: ShopSummary
}
