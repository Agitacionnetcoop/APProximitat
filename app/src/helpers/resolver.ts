const resolver = {
  icons: {
    logo: require('../assets/icons/logo.png'),
    home: require('../assets/icons/home.png'),
    discover: require('../assets/icons/discover.png'),
    profile: require('../assets/icons/profile.png'),
    activities: require('../assets/icons/activities.png'),
    not_found: require('../assets/icons/notFound.png'),
    search: require('../assets/icons/search.png'),
    notification: require('../assets/icons/notification.png'),
    arrow: require('../assets/icons/arrow.png'),
    heart: require('../assets/icons/heart.png'),
    share: require('../assets/icons/share.png'),
    shop: require('../assets/icons/shop.png'),
    settings: require('../assets/icons/settings.png'),
    logo_placeholder: require('../assets/icons/logoPlaceholder.png'),
    full_heart: require('../assets/icons/full_heart.png'),
    go: require('../assets/icons/go.png'),
    clock: require('../assets/icons/clock.png'),
    red_mob: require('../assets/icons/reduced_mob.png'),
    category: require('../assets/icons/category.png'),
    whatsapp: require('../assets/icons/whatsapp.png'),
    telegram: require('../assets/icons/telegram.png'),
    email: require('../assets/icons/email.png'),
    location: require('../assets/icons/location.png'),
    calendar: require('../assets/icons/calendar.png'),
    phone: require('../assets/icons/phone.png'),
    email_icon: require('../assets/icons/email_icon.png'),
    check: require('../assets/icons/check.png'),
    close: require('../assets/icons/close.png'),
    support: require('../assets/icons/support.png'),
    noResults: require('../assets/icons/no_results.png'),
    cross: require('../assets/icons/cross.png'),
  },
  not_found: require('../assets/icons/notFound.png'),
  videos: {
    1: require('../assets/videos/step1.mp4'),
    2: require('../assets/videos/step2.mp4'),
    3: require('../assets/videos/step3.mp4'),
  },
}

export type Resolver = typeof resolver
export type Icons = keyof (typeof resolver)['icons']
export type Image = Exclude<keyof typeof resolver, 'icons'>

export default resolver as Record<string, Record<string, any> | any>
