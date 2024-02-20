import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components/native'
import MapView, { Marker, Callout, MapMarker } from 'react-native-maps'
import { Dimensions, Platform } from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import { tabBarHeight, theme } from '../../settings/theme'
import ScreenContainer from '../common/ScreenContainer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Popup from './Popup'
import { getMapLocations } from '../../services/data.services'
import { ShopsMapProps } from '../types'
import { useStore } from '../../store/useStore'
import { useIsFocused } from '@react-navigation/native'
import resolver from '../../helpers/resolver'
import FastImage from 'react-native-fast-image'
import useDebounce from '../../hooks/useDebounce'

const MAP_STYLE = [
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
]

type LatLang = {
  latitude: number
  longitude: number
}

type Region = {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

type DataMarker = {
  id: number
  name: string
  description: string
  images: string[]
  latitude: string
  longitude: string
  distance: number
}

export type MarkerType = {
  id: number
  coordinate: LatLang
  name: string
  description: string
  images: string[]
  distance: number
}

const MapScreen = ({ navigation, route }: ShopsMapProps) => {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const { id, lat, lng } = route.params
  const { filters } = useStore(({ filters }) => ({
    filters,
  }))

  const deltaRegion = {
    latitudeDelta: 0.005,
    longitudeDelta: 0.004,
  }

  const markerRef = useRef<MapMarker | null>(null)

  const [paramId, setParamId] = useState<number | null>(null)
  const [data, setData] = useState<DataMarker[]>([])
  const [markers, setMarkers] = useState<MarkerType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [region, setRegion] = useState<Region>({
    latitude: 41.40661681482972,
    longitude: 2.1590592593746543,
    ...deltaRegion,
  })
  const [viewRegion, setViewRegion] = useState<Region | undefined>(undefined)
  const debouncedViewRegion = useDebounce(viewRegion, 300)

  const requestLocationAuth = () => {
    Geolocation.requestAuthorization(
      () => console.log('Getting location authorized'),
      error =>
        console.log('Error getting location authorization:', error.message),
    )
  }

  const loadData = async ({ lat, lng }: { lat: number; lng: number }) => {
    setLoading(true)
    const response = await getMapLocations({
      latitude: lat,
      longitude: lng,
      sustainabilityNames: filters.sustainability,
      categoryNames: filters.categories,
      page: 1,
      pageSize: 15,
      shopId: paramId,
    })
    if (response) {
      const newData = [...response, ...data]
      const uniqueData = newData.filter(
        (obj, index) => index === newData.findIndex(o => obj.id === o.id),
      )
      setData(uniqueData)
      const formattedMarkers: MarkerType[] = uniqueData.map(
        (i: DataMarker) => ({
          id: i.id,
          coordinate: {
            latitude: Number(i.latitude),
            longitude: Number(i.longitude),
          },
          distance: i.distance,
          name: i.name,
          description: i.description,
          images: i.images,
        }),
      )
      setMarkers(formattedMarkers)
      if (paramId && markerRef.current && markerRef.current.showCallout) {
        setTimeout(() => {
          markerRef.current?.showCallout()
          navigation.setParams({
            id: undefined,
            lat: undefined,
            lng: undefined,
          })
        }, 100)
      } else {
        markerRef.current = null
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData({
      lat: region.latitude,
      lng: region.longitude,
    })
  }, [filters, paramId, markerRef.current])

  useEffect(() => {
    if (debouncedViewRegion) {
      loadData({
        lat: debouncedViewRegion.latitude,
        lng: debouncedViewRegion.longitude,
      })
    }
  }, [debouncedViewRegion])

  useEffect(() => {
    if (id && lat && lng) {
      setParamId(id)
      setRegion({
        latitude: parseFloat(String(lat)),
        longitude: parseFloat(String(lng)),
        ...deltaRegion,
      })
    } else {
      setParamId(null)
    }
  }, [isFocused, id])

  useEffect(() => {
    if (!loading) {
      requestLocationAuth()
    }
  }, [])

  return (
    <ScreenContainer paddingHorizontal={0} disableScrollView>
      <MapContainer bottomInset={insets.bottom} topInset={insets.top}>
        <MapView
          customMapStyle={Platform.OS === 'android' ? MAP_STYLE : undefined}
          initialRegion={{
            latitude: 41.40661681482972,
            longitude: 2.1590592593746543,
            ...deltaRegion,
          }}
          region={region}
          onRegionChangeComplete={e => setViewRegion(e)}
          mapType="standard"
          zoomEnabled
          style={{
            width: '100%',
            height: '100%',
          }}
          showsBuildings={false}
          showsPointsOfInterest={false}
          showsIndoors={false}
          showsUserLocation={true}
          userInterfaceStyle="light"
        >
          {markers.map(m => {
            return (
              <Marker
                ref={paramId && m.id === paramId ? markerRef : null}
                key={m.id}
                coordinate={m.coordinate}
                onCalloutPress={() =>
                  navigation.navigate('ShopDetail', { id: m.id })
                }
                style={{ padding: 0 }}
                pointerEvents="auto"
              >
                {Platform.OS === 'ios' && (
                  <FastImage
                    source={resolver.icons['marker']}
                    style={{ height: 30, width: 30 }}
                    resizeMode="contain"
                  />
                )}
                <Callout>
                  <Popup item={m} />
                </Callout>
              </Marker>
            )
          })}
        </MapView>
      </MapContainer>
    </ScreenContainer>
  )
}

export default MapScreen

const MapContainer = styled.View<{ bottomInset: number; topInset: number }>`
  height: ${({ bottomInset, topInset }) =>
    Dimensions.get('window').height - tabBarHeight - bottomInset - topInset}px;
  width: ${Dimensions.get('window').width}px;
  position: relative;
  margin-top: ${theme.spacing[3]};
`
