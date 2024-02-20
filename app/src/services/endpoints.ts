import { API_URL } from '@env'

const endpoints = {
  categories: `${API_URL}home`,
  shop: `${API_URL}shop`,
  filter: `${API_URL}filter`,
  search: `${API_URL}search`,
  map: `${API_URL}map`,
  activities: `${API_URL}allActivities`,
  activity: `${API_URL}activityDetail`,
  literals: `${API_URL}literals`,
  // user
  register: `${API_URL}register`,
  auth: `${API_URL}login`,
  code: `${API_URL}getCode`,
  profile: `${API_URL}profile`,
  toggleFavorites: `${API_URL}toggleFavorites`,
  favorites: `${API_URL}favorites`,
  purchases: `${API_URL}purchases`,
  notifications: `${API_URL}listNotifications`,
  readNotifications: `${API_URL}readNotifications`,
  checkNotifications: `${API_URL}getUnreadNotificationsNumber`,
  deleteAccount: `${API_URL}deleteAccount`,
}

export default endpoints
