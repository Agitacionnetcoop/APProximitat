import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { FlatList } from 'react-native'

import { theme } from '../../settings/theme'
import { SavedShop, SavedShopsProps } from '../types'

import SavedShopCard from './SavedShopCard'
import ScreenContainer from '../common/ScreenContainer'

import { useStore } from '../../store/useStore'
import { getFavorites } from '../../services/user.services'
import ListEmptyComponent from '../common/ListEmptyComponent'
import { lang } from '../../helpers/language'

const SavedShopsScreen = ({ navigation, route }: SavedShopsProps) => {
  const { literals } = useStore.getState()
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<SavedShop[]>([])

  const loadData = async () => {
    setLoading(true)
    const response = await getFavorites()
    if (response) {
      setData(response)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])
  return (
    <ScreenContainer paddingHorizontal={0} disableScrollView>
      <Title>{literals[6]}</Title>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <SavedShopCard key={item.id} item={item} subtitle={literals[10]} />
          )
        }}
        ItemSeparatorComponent={() => <Separator />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        decelerationRate="fast"
        ListEmptyComponent={
          <ListEmptyComponent text={lang(literals[44])} loading={loading} />
        }
      />
    </ScreenContainer>
  )
}

export default SavedShopsScreen

const Title = styled.Text`
  font-family: ${theme.fonts.interMedium};
  font-size: ${theme.fonts.size[20]};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
  padding-bottom: ${theme.spacing[4]};
  padding-horizontal: ${theme.spacing[5]};
`
const Separator = styled.View`
  height: ${theme.spacing[2]};
`
