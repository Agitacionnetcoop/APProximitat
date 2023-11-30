import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { FlatList, View } from 'react-native'

import { theme } from '../../settings/theme'
import ShopCard from '../AllShops/ShopCard'
import { ShopSummary, ShopsCategoryProps } from '../types'
import { lang } from '../../helpers/language'
import ScreenContainer from '../common/ScreenContainer'
import { filterShops } from '../../services/data.services'
import { useStore } from '../../store/useStore'
import ListEmptyComponent from '../common/ListEmptyComponent'
import Loader from '../common/Loader'

const ShopsCategoryScreen = ({ navigation, route }: ShopsCategoryProps) => {
  const { item, type } = route.params
  const { literals } = useStore.getState()
  const pageSize = 10
  const [page, setPage] = useState<number>(1)
  const [data, setData] = useState<ShopSummary[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)

  const loadData = async (newPage?: number) => {
    setLoading(true)
    if (newPage && newPage > 1) setLoadingMore(true)
    const currentData = [...data]
    const body = {
      categoryName: type === 'category' ? item.name['ca'] : '',
      tagName: type === 'tag' ? item.name['ca'] : '',
      sustainabilityTagName: type === 'sustainability' ? item.name['ca'] : '',
    }
    const response = await filterShops({
      ...body,
      page: newPage,
      pageSize,
    })
    if (response) {
      const itemsAlreadyLoaded = () => {
        return response.filter((resValue: ShopSummary) => {
          currentData.some(dataValue => resValue.id === dataValue.id)
        })
      }
      if (itemsAlreadyLoaded.length > 0) {
        itemsAlreadyLoaded().map((i: ShopSummary) => {
          const indexOf = response.indexOf(i)
          response.splice(indexOf, 1)
        })
      }
      if (newPage) {
        setData([...currentData, ...response])
      } else {
        setData(response)
      }
    }
    setLoadingMore(false)
    setLoading(false)
  }

  useEffect(() => {
    if (page > 1) {
      loadData(page)
    }
  }, [page])

  useEffect(() => {
    setPage(1)
    loadData()
  }, [item, type])

  return (
    <ScreenContainer paddingHorizontal={0} disableScrollView>
      <TitleContainer>
        <Title>
          {`${lang(literals[38])}: `}
          <Bold>{lang(item.name)}</Bold>
        </Title>
      </TitleContainer>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <ShopCard
              key={item.id}
              onPress={() => navigation.navigate('ShopDetail', { id: item.id })}
              item={item}
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
          <ListEmptyComponent text={lang(literals[47])} loading={loading} />
        }
      />
      {loadingMore && (
        <View style={{ marginVertical: 30 }}>
          <Loader />
        </View>
      )}
    </ScreenContainer>
  )
}

const Bold = styled.Text`
  font-family: ${theme.fonts.notoSansSemiBold};
`
const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${theme.spacing[4]};
  padding-horizontal: ${theme.spacing[5]};
`
const Title = styled.Text`
  font-size: ${theme.fonts.size[18]};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
`
const Separator = styled.View`
  height: ${theme.spacing[4]};
`
export default ShopsCategoryScreen
