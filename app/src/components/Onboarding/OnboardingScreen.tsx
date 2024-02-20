import React, { useRef, useState } from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ScrollView,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Video from 'react-native-video'
import { useSwipe } from '../../hooks/useSwipe'
import { WelcomeProps } from '../types'
import resolver from '../../helpers/resolver'
import { useStore } from '../../store/useStore'
import { StatusBar } from 'react-native'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const OnboardingScreen = ({ navigation }: WelcomeProps) => {
  const insets = useSafeAreaInsets()
  const { literals } = useStore.getState()
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  const slidesData = [
    {
      id: 1,
      title: literals[71],
      text: `${literals[72]} `,
      enhance: literals[73],
    },
    {
      id: 2,
      title: literals[74],
      text: literals[75],
    },
    {
      id: 3,
      title: literals[76],
      text: literals[77],
    },
  ]

  const handleCurrentSlide = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const totalWidth = event.nativeEvent.layoutMeasurement.width
    const xPosition = event.nativeEvent.contentOffset.x
    const calculatedIndex = xPosition / totalWidth
    const currentIndex = calculatedIndex > 0 ? Math.floor(calculatedIndex) : 0
    setCurrentSlide(currentIndex)
  }
  const videoRef = useRef<any>()
  const { onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight)

  function onSwipeLeft() {
    if (currentSlide === 2 && Platform.OS === 'android') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Filters', params: { firstConfig: true } }],
      })
    }
  }

  function onSwipeRight() {
    if (currentSlide === 2 && Platform.OS === 'ios') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Filters', params: { firstConfig: true } }],
      })
    }
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
        height: SCREEN_HEIGHT,
      }}
    >
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
        horizontal
        onScroll={e => handleCurrentSlide(e)}
        scrollEventThrottle={30}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="center"
        snapToInterval={SCREEN_WIDTH}
        overScrollMode="always"
        onScrollEndDrag={onTouchEnd}
        pagingEnabled
      >
        {slidesData.map(item => {
          const source = resolver.videos[item.id]
          return (
            <Slide key={item.id}>
              <Content>
                <View
                  style={{
                    height: '60%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Video
                    source={source}
                    ref={videoRef}
                    style={{
                      height: SCREEN_WIDTH * 0.9 * 0.825,
                      width: SCREEN_WIDTH * 0.9,
                    }}
                    onBuffer={data => console.log('buffer', data)}
                    onError={data => console.log('error', data)}
                    repeat
                    muted
                    controls={false}
                    resizeMode="contain"
                  />
                </View>
                <View
                  style={{
                    height: '40%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Title>{item.title}</Title>
                  <Description>{item.text}</Description>
                  {item.enhance && <EnhancedText>{item.enhance}</EnhancedText>}
                </View>
              </Content>
            </Slide>
          )
        })}
      </ScrollView>
      <DotsContainer>
        {slidesData.map((item, index) => {
          return (
            <Dot
              key={item.id}
              style={{
                backgroundColor:
                  index === currentSlide
                    ? theme.colors.grayD9D9D9
                    : theme.colors.black,
              }}
            />
          )
        })}
      </DotsContainer>
    </View>
  )
}

export default OnboardingScreen

const Slide = styled.View`
  width: ${SCREEN_WIDTH}px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Content = styled.View`
  padding-horizontal: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 85%;
`
const Title = styled.Text`
  font-family: ${theme.fonts.merriweatherBlack};
  font-size: ${theme.fonts.size[32]};
  line-height: ${theme.fonts.height[40]};
  text-align: center;
  color: ${theme.colors.black};
  padding-bottom: ${theme.spacing[4]};
`
const Description = styled.Text`
  font-family: ${theme.fonts.playfairRegular};
  font-size: ${theme.fonts.size[24]};
  line-height: ${theme.fonts.height[32]};
  text-align: center;
  color: ${theme.colors.black};
`
const EnhancedText = styled.Text`
  font-family: ${theme.fonts.playfairBold};
  font-size: ${theme.fonts.size[24]};
  line-height: ${theme.fonts.height[32]};
  text-align: center;
  color: ${theme.colors.black};
`
const DotsContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  padding-vertical: ${theme.spacing[5]};
`
const Dot = styled.View`
  border-radius: 100px;
  border: solid 1px ${theme.colors.black};
  aspect-ratio: 1/1;
  width: ${theme.spacing[4]};
`
