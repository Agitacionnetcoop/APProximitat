import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { FlatList } from 'react-native'

import { theme } from '../../settings/theme'
import { Purchase, PurchasesProps } from '../types'

import PurchaseCard from './PurchaseCard'
import ScreenContainer from '../common/ScreenContainer'

import { useStore } from '../../store/useStore'
import { getPurchases } from '../../services/user.services'
import ListEmptyComponent from '../common/ListEmptyComponent'
import { lang } from '../../helpers/language'

const PurchasesScreen = ({ navigation, route }: PurchasesProps) => {
  const { literals } = useStore.getState()
  const [data, setData] = useState<Purchase[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const loadData = async () => {
    setLoading(true)
    const response = await getPurchases()
    if (response) {
      setData(response)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <ScreenContainer disableScrollView paddingHorizontal={0}>
      <Title>{literals[7]}</Title>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return (
            <PurchaseCard
              key={item.id}
              item={item}
              buttonLabel={literals[12]}
            />
          )
        }}
        ItemSeparatorComponent={() => <Separator />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        decelerationRate="fast"
        ListEmptyComponent={
          <ListEmptyComponent text={lang(literals[43])} loading={loading} />
        }
      />
    </ScreenContainer>
  )
}

export default PurchasesScreen

const Title = styled.Text`
  font-family: ${theme.fonts.interMedium};
  font-size: ${theme.fonts.size[20]};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
  padding-bottom: ${theme.spacing[4]};
  padding-horizontal: ${theme.spacing[5]};
`
const Separator = styled.View`
  height: ${theme.spacing[4]};
`
