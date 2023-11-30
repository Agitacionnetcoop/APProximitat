import { useStore } from '../store/useStore'
import { ErrorAlert } from './alerts'
import doFetch from './doFetch'
import endpoints from './endpoints'

export const register = async ({
  name,
  email,
}: {
  name: string
  email: string
}) => {
  try {
    const response = await doFetch('POST', endpoints.register, { name, email })
    const data = await response.json()
    if (data) {
      return data
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const login = async ({ email }: { email: string }) => {
  try {
    const response = await doFetch('POST', endpoints.code, { email })
    const data = await response.json()
    if (data) {
      return data
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const authUser = async ({
  email,
  code,
  playerId,
}: {
  email: string
  code: string
  playerId: string
}) => {
  try {
    const response = await doFetch('POST', endpoints.auth, {
      email,
      code,
      playerId,
    })
    const data = await response.json()
    if (data) {
      return data
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const profile = async ({
  name,
  email,
}: {
  name: string
  email: string
}) => {
  const { token } = useStore.getState()
  try {
    const response = await doFetch(
      'PUT',
      endpoints.profile,
      { name, email },
      token,
    )
    const data = await response.json()
    if (data.user) {
      return data.user
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const toggleFavorites = async (id: number) => {
  const { token } = useStore.getState()
  try {
    const response = await doFetch(
      'PUT',
      endpoints.toggleFavorites,
      { shopId: id },
      token,
    )
    const data = await response.json()
    if (data) {
      return data.favorite
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const getFavorites = async () => {
  const { token } = useStore.getState()
  try {
    const response = await doFetch('POST', endpoints.favorites, {}, token)
    const data = await response.json()
    if (data.results) {
      return data.results
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}

export const getPurchases = async () => {
  const { token } = useStore.getState()
  try {
    const response = await doFetch('POST', endpoints.purchases, {}, token)
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

export const getNotifications = async () => {
  const { token } = useStore.getState()
  try {
    const response = await doFetch('POST', endpoints.notifications, {}, token)
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

export const deleteAccount = async () => {
  const { token } = useStore.getState()
  try {
    const response = await doFetch('DELETE', endpoints.deleteAccount, {}, token)
    const data = await response.json()
    if (data.deleted) {
      return data
    } else {
      ErrorAlert(data.message)
    }
  } catch (err: any) {
    ErrorAlert(`${err as string}`)
  }
}
