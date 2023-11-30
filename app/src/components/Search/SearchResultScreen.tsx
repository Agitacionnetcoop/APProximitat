import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { FlatList, View } from 'react-native'
import { FlatList as FlatListType } from 'react-native/types'
import { theme } from '../../settings/theme'
import ShopCard from '../AllShops/ShopCard'
import { searchShops } from '../../services/data.services'
import { SearchResultProps, ShopSummary } from '../types'
import ScreenContainer from '../common/ScreenContainer'
import NoResultsFound from '../Filters/NoResultsFound'
import { lang } from '../../helpers/language'
import { useStore } from '../../store/useStore'
import Loader from '../common/Loader'

const SearchResultScreen = ({ navigation, route }: SearchResultProps) => {
  const { literals } = useStore.getState()
  const { searchValue } = route.params
  const pageSize = 10
  const [page, setPage] = useState<number>(1)
  const [data, setData] = useState<ShopSummary[]>([])
  const listRef = useRef<FlatListType>()
  const [loadingMore, setLoadingMore] = useState<boolean>(false)

  const loadSearchData = async (newPage?: number) => {
    if (newPage && newPage > 1) setLoadingMore(true)
    const currentData = [...data]
    const response = await searchShops({
      search: searchValue,
      pageSize,
      page: newPage,
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
        listRef.current?.scrollToOffset({ animated: false, offset: 0 })
      }
    }
    setLoadingMore(false)
  }

  useEffect(() => {
    if (page > 1) {
      loadSearchData(page)
    }
  }, [page])

  useEffect(() => {
    setPage(1)
    loadSearchData()
  }, [searchValue])

  return (
    <ScreenContainer disableScrollView>
      <TitleContainer>
        <Title>
          {`${lang(literals[45])}: `}
          <Bold>{`"${searchValue}"`}</Bold>
        </Title>
      </TitleContainer>
      <FlatList
        ref={listRef}
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
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        initialNumToRender={pageSize}
        onEndReached={() => {
          if (data.length >= page * pageSize) {
            setPage(page + 1)
          }
        }}
        onEndReachedThreshold={0.5}
        bounces={false}
        ItemSeparatorComponent={() => <Separator />}
        ListEmptyComponent={<NoResultsFound />}
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
`
const Title = styled.Text`
  font-size: ${theme.fonts.size[18]};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
`
const Separator = styled.View`
  height: ${theme.spacing[4]};
`

export default SearchResultScreen
