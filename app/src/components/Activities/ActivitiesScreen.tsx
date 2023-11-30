import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { FlatList, View } from 'react-native'

import { theme } from '../../settings/theme'
import ScreenContainer from '../common/ScreenContainer'
import ActivityCard from './ActivityCard'
import ActivityTags from './ActivityTags'
import { useStore } from '../../store/useStore'
import { getActivities } from '../../services/data.services'
import { Activity, AllActivitiesProps, TagItem } from '../types'
import ListEmptyComponent from '../common/ListEmptyComponent'
import { lang } from '../../helpers/language'

const ActivitiesScreen = ({ navigation }: AllActivitiesProps) => {
  const { literals } = useStore.getState()
  const [tags, setTags] = useState<TagItem[]>([])
  const [data, setData] = useState<Activity[]>([])
  const pageSize = 10
  const [page, setPage] = useState<number>(1)
  const [activityCatId, setActivityCatId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const filterActivities = (id: number) => {
    if (activityCatId === id) {
      setActivityCatId(null)
    } else {
      setActivityCatId(id)
    }
  }

  const loadData = async (newPage?: number) => {
    setLoading(true)
    const currentData = [...data]
    const body = {
      page,
      pageSize,
    }
    if (activityCatId) {
      Object.assign(body, { activityCatId })
    }
    const response = await getActivities(body)
    if (response) {
      const itemsAlreadyLoaded = () => {
        return response.activities.filter((resValue: Activity) => {
          currentData.some(dataValue => resValue.id === dataValue.id)
        })
      }
      if (itemsAlreadyLoaded.length > 0) {
        itemsAlreadyLoaded().map((i: Activity) => {
          const indexOf = response.activities.indexOf(i)
          response.activities.splice(indexOf, 1)
        })
      }
      if (newPage) {
        setData([...currentData, ...response.activities])
      } else {
        setData(response.activities)
        setTags(response.tags)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    if (page > 1) {
      loadData(page)
    }
  }, [page])

  useEffect(() => {
    if (activityCatId) {
      setPage(1)
    }
    loadData()
  }, [activityCatId])

  return (
    <ScreenContainer paddingHorizontal={0} disableScrollView>
      <TitleContainer>
        <Title>{literals[14]}</Title>
      </TitleContainer>
      <View>
        <ActivityTags
          tags={tags}
          callback={id => filterActivities(id)}
          active={activityCatId}
        />
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <ActivityCard
              key={item.id}
              onPress={() =>
                navigation.navigate('ActivityDetail', { id: item.id })
              }
              item={item}
              buttonLabel={literals[13]}
            />
          )
        }}
        ItemSeparatorComponent={() => <Separator />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        decelerationRate="fast"
        initialNumToRender={pageSize}
        onEndReached={() => {
          if (data.length >= page * pageSize) {
            setPage(page + 1)
          }
        }}
        onEndReachedThreshold={0.5}
        bounces={false}
        ListEmptyComponent={
          <ListEmptyComponent text={lang(literals[34])} loading={loading} />
        }
      />
    </ScreenContainer>
  )
}

const TitleContainer = styled.View`
  padding-top: ${theme.spacing[4]};
  padding-bottom: ${theme.spacing[3]};
  padding-horizontal: ${theme.spacing[5]};
`
const Title = styled.Text`
  font-size: ${theme.fonts.size[20]};
  line-height: ${theme.fonts.height[24]};
  font-family: ${theme.fonts.interMedium};
  color: ${theme.colors.black};
`
const Separator = styled.View`
  height: ${theme.spacing[4]};
`

export default ActivitiesScreen
