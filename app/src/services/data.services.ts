import { useStore } from '../store/useStore'
import { ErrorAlert } from './alerts'
import doFetch from './doFetch'
import endpoints from './endpoints'

export const getLiterals = async () => {
  try {
    const response = await doFetch('GET', endpoints.literals)
    const data = await response.json()
    if (data && data.literals) {
      return data
    } else {
      return data
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const getCategories = async ({
  sustainabilityNames = [],
  categoryNames = [],
}: {
  sustainabilityNames: string[]
  categoryNames: string[]
}) => {
  const { token } = useStore.getState()
  try {
    const response = await doFetch(
      'POST',
      endpoints.categories,
      { sustainabilityNames, categoryNames },
      token,
    )
    const data = await response.json()
    if (data?.categories) {
      return data.categories
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const getShop = async ({
  id,
  userId,
}: {
  id: number
  userId?: number | null
}) => {
  try {
    const response = await doFetch('POST', endpoints.shop, { id, userId })
    const data = await response.json()
    if (data?.shop) {
      return data.shop
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const filterShops = async ({
  categoryName = '',
  tagName = '',
  sustainabilityTagName = '',
  page = 1,
  pageSize = 15,
}: {
  categoryName?: string
  tagName?: string
  sustainabilityTagName?: string
  page?: number
  pageSize?: number
}) => {
  try {
    const response = await doFetch('POST', endpoints.filter, {
      categoryName,
      tagName,
      sustainabilityTagName,
      page,
      pageSize,
    })
    const data = await response.json()
    if (data?.shops) {
      return data.shops
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const searchShops = async ({
  search,
  page = 1,
  pageSize = 15,
}: {
  search: string
  page?: number
  pageSize?: number
}) => {
  try {
    const response = await doFetch('POST', endpoints.search, {
      search,
      page,
      pageSize,
    })
    const data = await response.json()
    if (data?.shops) {
      return data.shops
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const getActivities = async ({
  page = 1,
  pageSize = 15,
  activityCatId,
}: {
  page?: number
  pageSize?: number
  activityCatId?: number
}) => {
  const body: { page: number; pageSize: number; activityCatId?: number } = {
    page,
    pageSize,
  }
  if (activityCatId) {
    body.activityCatId = activityCatId
  }
  try {
    const response = await doFetch('POST', endpoints.activities, body)
    const data = await response.json()
    if (data) {
      return data
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const getActivity = async ({ id }: { id: number }) => {
  try {
    const response = await doFetch('POST', endpoints.activity, {
      activityId: id,
    })
    const data = await response.json()
    if (data?.activity) {
      return data.activity
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const getMapLocations = async ({
  latitude,
  longitude,
  sustainabilityNames = [],
  categoryNames = [],
  page = 1,
  pageSize = 30,
  shopId = null,
}: {
  latitude: number
  longitude: number
  sustainabilityNames: string[]
  categoryNames: string[]
  page?: number
  pageSize?: number
  shopId?: number | null
}) => {
  try {
    const response = await doFetch('POST', endpoints.map, {
      latitude,
      longitude,
      sustainabilityNames,
      categoryNames,
      page,
      pageSize,
      shopId,
    })
    const data = await response.json()
    if (data?.shops) {
      return data.shops
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}
