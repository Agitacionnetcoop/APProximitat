import React from 'react'
import styled from 'styled-components/native'
import Image from '../common/Image'
import { theme } from '../../settings/theme'
import ShopLogoTitle from '../common/ShopLogoTitle'
import { MarkerType } from './MapScreen'
import { Dimensions, Platform, View } from 'react-native'
import { SvgCss } from 'react-native-svg'
import WebView from 'react-native-webview'

const Popup = ({ item }: { item: MarkerType }) => {
  const height = 115

  return (
    <Container>
      {Platform.OS === 'android' ? (
        <>
          {item.images?.length > 0 ? (
            <View
              style={{
                height: height,
                width: '100%',
              }}
            >
              <WebView
                style={{
                  height: '100%',
                  width: '100%',
                }}
                source={{ uri: item.images[0] }}
              />
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: height,
                width: '100%',
                backgroundColor: theme.colors.grayD9D9D9,
              }}
            >
              <SvgCss
                width="50%"
                height="50%"
                xml={`
                  <svg width="100%" height="100%" viewBox="0 0 26 26" version="1.1">
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="forbidden-simbol-svgrepo-com" transform="translate(0.000000, 0.001000)" fill="#ffffff" fill-rule="nonzero">
                          <path 
                            d="M12.568,0 C5.627,0 0,5.627 0,12.568 C0,19.511 5.627,25.136 12.568,25.136 C19.511,25.136 25.138,19.511 25.138,12.568 C25.139,5.627 19.512,0 12.568,0 Z M21.32,12.568 C21.32,14.291 20.818,15.898 19.955,17.254 L7.885,5.182 C9.24,4.319 10.846,3.81499981 12.569,3.81499981 C17.395,3.814 21.32,7.74 21.32,12.568 Z M3.818,12.568 C3.818,10.843 4.32,9.238 5.181,7.882 L17.253,19.954 C15.899,20.813 14.29,21.3190002 12.567,21.3190002 C7.742,21.32 3.818,17.393 3.818,12.568 Z"
                            id="Shape"
                          >
                          </path>
                      </g>
                  </g>
                </svg>
              `}
              />
            </View>
          )}
        </>
      ) : (
        <Image
          image={item.images?.length > 0 ? item.images[0] : ''}
          height={height}
          shopId={item.id}
        />
      )}
      <Content>
        <ShopLogoTitle title={item.name} ellipsis />
        {item.description && (
          <Description numberOfLines={3} ellipsizeMode="tail">
            {item.description}
          </Description>
        )}
      </Content>
    </Container>
  )
}

export default Popup

const Container = styled.View`
  background: white;
  width: ${Dimensions.get('window').width * 0.65}px;
  min-height: ${Dimensions.get('window').width * 0.65 * 0.94}px;
  display: flex;
  flex-direction: column;
`
const Content = styled.View`
  padding-horizontal: ${theme.spacing[4]};
  padding-vertical: ${theme.spacing[2]};
  flex: 1;
`
const Description = styled.Text`
  padding-top: ${theme.spacing[1]};
  font-family: ${theme.fonts.notoSansRegular};
  font-size: ${theme.fonts.size[13]};
  line-height: ${theme.fonts.height[18]};
  color: ${theme.colors.black};
`
