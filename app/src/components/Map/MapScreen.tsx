import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import {
  AnimationType,
  INFINITE_ANIMATION_ITERATIONS,
  LeafletView,
  MapMarker,
  OWN_POSTION_MARKER_ID,
  WebviewLeafletMessage,
} from 'react-native-leaflet-view'
import { Dimensions } from 'react-native'
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation'

import { tabBarHeight, theme } from '../../settings/theme'
import ScreenContainer from '../common/ScreenContainer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Popup from './Popup'
import { getMapLocations } from '../../services/data.services'
import { ShopsMapProps } from '../types'
import { useStore } from '../../store/useStore'
import { useIsFocused } from '@react-navigation/native'

const MARKER_ICON = `
  <svg width="29" height="44" fill="none">
    <path
      fill="#FF6464"
      d="M28.996 14.62c0 8.076-14.498 29.38-14.498 29.38S0 22.696 0 14.62C.004 6.545 6.495 0 14.502 0 22.509 0 29 6.545 29 14.62h-.004Z"
    />
    <path
      fill="#fff"
      d="M21.314 13.978c0 3.797-3.052 6.873-6.816 6.873-3.763 0-6.816-3.076-6.816-6.873s3.053-6.873 6.816-6.873c3.764 0 6.816 3.076 6.816 6.873Z"
    />
  </svg>
`

type Coordinates = {
  lat: number
  lng: number
}

type OwnMarker = {
  id: typeof OWN_POSTION_MARKER_ID
  position: Coordinates
  icon: string
  size: [number, number]
  animation: {
    type: AnimationType
    duration: number
    iterationCount: typeof INFINITE_ANIMATION_ITERATIONS
  }
}

export type Marker = {
  id: number
  name: string
  latitude: string
  longitude: string
  distance: number
  images: string[]
  description: string
}

const MapScreen = ({ navigation, route }: ShopsMapProps) => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const { id, lat, lng } = route.params
  const { filters } = useStore(({ filters }) => ({
    filters,
  }))

  const [centerPosition, setCenterPosition] = useState<Coordinates>({
    lat: 41.40661681482972,
    lng: 2.1590592593746543,
  })
  const [activeMarker, setActiveMarker] = useState<Marker | undefined>(
    undefined,
  )
  const [paramId, setParamId] = useState<number | null>(null)
  const [ownMarker, setOwnMarker] = useState<OwnMarker | undefined>(undefined)
  const [data, setData] = useState<Marker[]>([])
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const ownPosition: OwnMarker = {
    id: OWN_POSTION_MARKER_ID,
    position: centerPosition,
    icon: '◉',
    size: [45, 45],
    animation: {
      type: AnimationType.PULSE,
      duration: 5,
      iterationCount: INFINITE_ANIMATION_ITERATIONS,
    },
  }

  const requestLocationAuth = () => {
    Geolocation.requestAuthorization(
      () => getUserLocation(),
      error =>
        console.log('Error getting location authorization:', error.message),
    )
  }

  const getUserLocation = (): void => {
    Geolocation.getCurrentPosition(
      location => {
        setUserLocation(location)
      },
      error => console.log('Error getting location:', error.message),
    )
  }

  const setUserLocation = (location: GeolocationResponse): void => {
    if (location) {
      const userPosition = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      }
      Object.assign(ownPosition, { position: userPosition })
      if (
        ownMarker &&
        ownMarker.position.lat.toFixed(3) ===
          ownPosition.position.lat.toFixed(3) &&
        ownMarker.position.lng.toFixed(3) ===
          ownPosition.position.lng.toFixed(3)
      ) {
        return
      } else {
        setOwnMarker(ownPosition)
      }
    }
  }

  const handleInteraction = (e: WebviewLeafletMessage) => {
    switch (e.event) {
      case 'onMapMarkerClicked':
        handleActiveMarker(e)
        break
      case 'onMoveEnd':
        loadData(e.payload?.mapCenterPosition)
        break
      default:
        break
    }
  }

  const handleActiveMarker = (e: WebviewLeafletMessage) => {
    if (e.event === 'onMapMarkerClicked') {
      const activeMarkerData = markers.find(
        m => m.id === e.payload?.mapMarkerID,
      )
      if (activeMarkerData) {
        const activeShop = data.find(
          item => String(item.id) === activeMarkerData.id,
        )
        setActiveMarker(activeShop)
      }
    }
  }

  const loadData = async ({
    lat,
    lng,
    page,
  }: {
    lat: number
    lng: number
    page?: number
  }) => {
    setLoading(true)
    const response = await getMapLocations({
      latitude: lat,
      longitude: lng,
      sustainabilityNames: filters.sustainability,
      categoryNames: filters.categories,
      page: page || 1,
      pageSize: 15,
      shopId: paramId,
    })
    if (response) {
      setData(response)
      const formattedMarkers = response.map((i: Marker) => ({
        id: String(i.id),
        position: { lat: Number(i.latitude), lng: Number(i.longitude) },
        icon: MARKER_ICON,
        size: [29, 44],
      }))
      setMarkers(formattedMarkers)
      if (paramId) {
        const openMarker = response.find(
          (m: Marker) => Number(m.id) === paramId,
        )
        if (openMarker) {
          setActiveMarker(openMarker)
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData({
      lat: centerPosition.lat,
      lng: centerPosition.lng,
    })
  }, [filters, centerPosition])

  useEffect(() => {
    if (lat && lng) {
      setCenterPosition({ lat: lat, lng: lng })
    }
  }, [lat, lng])

  useEffect(() => {
    if (id) {
      setParamId(id)
    } else {
      setParamId(null)
    }
  }, [isFocused])

  useEffect(() => {
    if (!loading) {
      requestLocationAuth()
    }
  }, [])

  useEffect(() => {
    if (ownMarker) {
      const watchId: number = Geolocation.watchPosition(
        location => setUserLocation(location),
        error => console.log('Error watching location:', error.message),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
          interval: 1000,
          distanceFilter: 0,
        },
      )
      return () => Geolocation.clearWatch(watchId)
    }
  }, [ownMarker])

  return (
    <ScreenContainer paddingHorizontal={0} disableScrollView>
      <Map bottomInset={insets.bottom} topInset={insets.top}>
        <LeafletView
          zoom={17}
          mapCenterPosition={centerPosition}
          ownPositionMarker={ownMarker}
          mapMarkers={markers}
          onMessageReceived={e => handleInteraction(e)}
        />
        {activeMarker && (
          <Overlay bottomInset={insets.bottom}>
            <OverlayElementsContainer>
              <ClosePopup
                onPress={() => {
                  setActiveMarker(undefined)
                  setParamId(null)
                }}
              />
              <Popup navigation={navigation} item={activeMarker} />
            </OverlayElementsContainer>
          </Overlay>
        )}
      </Map>
    </ScreenContainer>
  )
}

export default MapScreen

const Map = styled.View<{ bottomInset: number; topInset: number }>`
  height: ${({ bottomInset, topInset }) =>
    Dimensions.get('window').height - tabBarHeight - bottomInset - topInset}px;
  width: ${Dimensions.get('window').width}px;
  position: relative;
  margin-top: ${theme.spacing[3]};
`
const Overlay = styled.View<{ bottomInset: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: ${({ bottomInset }) => tabBarHeight - bottomInset}px;
`
const OverlayElementsContainer = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`
const ClosePopup = styled.Pressable`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.black};
  opacity: 0.2;
`
