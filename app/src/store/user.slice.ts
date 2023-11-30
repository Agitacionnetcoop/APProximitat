/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

import { User } from '../components/types'

const slice = (set: any, get: any) => ({
  token: '',
  user: {},
  setToken: (token: string) =>
    set((state: any) => ({
      ...state,
      token,
    })),
  setUser: (user: User) =>
    set((state: any) => ({
      ...state,
      user,
    })),
})

export default slice
