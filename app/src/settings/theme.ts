import { Theme } from '@react-navigation/native'
import { ViewStyle, TextStyle } from 'react-native'

// Inter
const interBlack = 'Inter-Black'
const interBold = 'Inter-Bold'
const interExtraBold = 'Inter-ExtraBold'
const interExtraLight = 'Inter-ExtraLight'
const interLight = 'Inter-Light'
const interMedium = 'Inter-Medium'
const interRegular = 'Inter-Regular'
const interSemiBold = 'Inter-SemiBold'
const interThin = 'Inter-Thin'

// Merriweather
const merriweatherBlack = 'Merriweather-Black'
const merriweatherBlackItalic = 'Merriweather-BlackItalic'
const merriweatherBold = 'Merriweather-Bold'
const merriweatherLight = 'Merriweather-Light'
const merriweatherBoldItalic = 'Merriweather-BoldItalic'
const merriweatherRegular = 'Merriweather-Regular'
const merriweatherItalic = 'Merriweather-Italic'
const merriweatherLightItalic = 'Merriweather-LightItalic'

// Noto Sans
const notoSansBlack = 'NotoSans-Black'
const notoSansBlackItalic = 'NotoSans-BlackItalic'
const notoSansBold = 'NotoSans-Bold'
const notoSansBoldItalic = 'NotoSans-BoldItalic'
const notoSansExtraBold = 'NotoSans-ExtraBold'
const notoSansExtraBoldItalic = 'NotoSans-ExtraBoldItalic'
const notoSansExtraLight = 'NotoSans-ExtraLight'
const notoSansExtraLightItalic = 'NotoSans-ExtraLightItalic'
const notoSansItalic = 'NotoSans-Italic'
const notoSansLight = 'NotoSans-Light'
const notoSansLightItalic = 'NotoSans-LightItalic'
const notoSansMedium = 'NotoSans-Medium'
const notoSansMediumItalic = 'NotoSans-MediumItalic'
const notoSansRegular = 'NotoSans-Regular'
const notoSansSemiBold = 'NotoSans-SemiBold'
const notoSansSemiBoldItalic = 'NotoSans-SemiBoldItalic'
const notoSansThin = 'NotoSans-Thin'
const notoSansThinItalic = 'NotoSans-ThinItalic'

// Playfair Display
const playfairBlack = 'PlayfairDisplay-Black'
const playfairBlackItalic = 'PlayfairDisplay-BlackItalic'
const playfairBold = 'PlayfairDisplay-Bold'
const playfairBoldItalic = 'PlayfairDisplay-BoldItalic'
const playfairExtraBold = 'PlayfairDisplay-ExtraBold'
const playfairExtraBoldItalic = 'PlayfairDisplay-ExtraBoldItalic'
const playfairItalic = 'PlayfairDisplay-Italic'
const playfairMedium = 'PlayfairDisplay-Medium'
const playfairMediumItalic = 'PlayfairDisplay-MediumItalic'
const playfairRegular = 'PlayfairDisplay-Regular'
const playfairSemiBold = 'PlayfairDisplay-SemiBold'
const playfairSemiBoldItalic = 'PlayfairDisplay-SemiBoldItalic'

// Roboto
const robotoBlack = 'Roboto-Black'
const robotoBlackItalic = 'Roboto-BlackItalic'
const robotoBold = 'Roboto-Bold'
const robotoBoldItalic = 'Roboto-BoldItalic'
const robotoItalic = 'Roboto-Italic'
const robotoLight = 'Roboto-Light'
const robotoLightItalic = 'Roboto-LightItalic'
const robotoMedium = 'Roboto-Medium'
const robotoMediumItalic = 'Roboto-MediumItalic'
const robotoRegular = 'Roboto-Regular'
const robotoThin = 'Roboto-Thin'
const robotoThinItalic = 'Roboto-ThinItalic'

export const theme = {
  colors: {
    background: '#F8F5EC',
    notification: '#990000',
    primary: '#FF4242',
    primaryLight: '#FFE8D1',
    transparent: 'rgba(0, 0, 0, 0)',
    white: '#FFFFFF',
    black: '#000000',
    red: '#F83131',
    green: '#014938',
    turquoise: '#24FDC9',
    purple: '#5F23DE',
    grayD9D9D9: '#D9D9D9',
    gray7A7A7A: '#7A7A7A',
    gray949494: '#949494',
    gray96929E: '#96929E',
    grayB0B0B0: '#B0B0B0',
  },
  fonts: {
    playfairRegular: playfairRegular,
    playfairMedium: playfairMedium,
    playfairBold: playfairBold,
    merriweatherBold: merriweatherBold,
    merriweatherBlack: merriweatherBlack,
    notoSansRegular: notoSansRegular,
    notoSansSemiBold: notoSansSemiBold,
    notoSansBold: notoSansBold,
    notoSansMedium: notoSansMedium,
    interRegular: interRegular,
    interMedium: interMedium,
    interSemiBold: interSemiBold,
    height: {
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px',
      18: '18px',
      20: '20px',
      22: '22px',
      24: '24px',
      28: '28px',
      30: '30px',
      32: '32px',
      34: '34px',
      40: '40px',
    },
    size: {
      10: '10px',
      12: '12px',
      13: '13px',
      14: '14px',
      16: '16px',
      18: '18px',
      20: '20px',
      22: '22px',
      24: '24px',
      28: '28px',
      32: '32px',
    },
  },
  spacing: {
    1: '4px',
    '1.5': '6px',
    2: '8px',
    '2.5': '10px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    11: '44px',
    12: '48px',
    13: '52px',
    14: '56px',
    15: '60px',
    16: '64px',
    17: '68px',
    18: '72px',
    19: '76px',
    20: '80px',
    24: '96px',
    28: '112px',
    32: '128px',
    36: '144px',
    40: '160px',
  },
}

export const shadow: ViewStyle = {
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.14,
  shadowRadius: 3.0,
  shadowColor: theme.colors.black,
  elevation: 4,
}
export const searchShadow: ViewStyle = {
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.25,
  shadowRadius: 2.0,
  shadowColor: theme.colors.black,
  elevation: 4,
}

export const navTheme: Theme = {
  dark: false,
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.white,
    text: theme.colors.black,
    border: theme.colors.transparent,
    notification: theme.colors.notification,
  },
}

export const tabBarHeight = 84
export const tabBarStyle: ViewStyle = {
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.7,
  shadowRadius: 10.0,
  elevation: 12,
  backgroundColor: theme.colors.white,
  shadowColor: theme.colors.black,
  position: 'absolute',
  bottom: 0,
  padding: 10,
  width: '100%',
  height: 84,
  zIndex: 0,
  paddingBottom: '5%',
}
export const tabBarLabelStyle: TextStyle = {
  fontFamily: theme.fonts.notoSansRegular,
  fontSize: 11,
  lineHeight: 15,
}
