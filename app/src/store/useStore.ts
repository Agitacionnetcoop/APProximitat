import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import createUserSlice from './user.slice'
import {
  FilterOptions,
  Filters,
  Language,
  SavedShop,
  User,
} from '../components/types'

interface StoreState {
  firstTimeOpeningApp: boolean
  appOpened: () => void
  literals: Record<string, string>
  filterOptions: FilterOptions
  language: Language
  token: string
  user: User
  filters: { categories: string[]; sustainability: string[] }
  favorites: SavedShop[]
  setLanguage: (language: Language) => void
  setLiterals: (literals: Record<string, string>) => void
  setFilterOptions: (filterOptions: FilterOptions) => void
  setToken: (token: string) => void
  setUser: (user: User) => void
  setFilters: (filters: Filters) => void
  setFavorites: (favorites: SavedShop[]) => void
}
interface SearchState {
  search: string
  setSearch: (search: string) => void
}

export const useStore = create<StoreState, [['zustand/persist', StoreState]]>(
  persist(
    (set, get) => ({
      firstTimeOpeningApp: true,
      appOpened: () => set(() => ({ firstTimeOpeningApp: false })),
      language: 'ca',
      literals: {},
      filterOptions: { categories: [], sustainability: [] },
      filters: { categories: [], sustainability: [] },
      setFilters: filters => set(() => ({ filters })),
      favorites: [],
      setFavorites: favorites => set({ favorites }),
      setLiterals: literals => set(() => ({ literals })),
      setFilterOptions: filterOptions => set(() => ({ filterOptions })),
      setLanguage: language => set(() => ({ language })),
      config: {},
      ...createUserSlice(set, get),
    }),
    {
      name: 'storage',
      storage: createJSONStorage(() => AsyncStorage),
      //getStorage: () => AsyncStorage
    },
  ),
)

export const useSearch = create<SearchState>((set, get) => ({
  search: '',
  setSearch: search => set(() => ({ search })),
}))
