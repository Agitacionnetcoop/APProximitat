import React from 'react'
import { Dimensions, FlatList, View } from 'react-native'
import { styled } from 'styled-components/native'

import ShopCard from './ShopCard'
import { theme } from '../../settings/theme'
import { NavigationType, ShopSummary } from '../types'
import { useNavigation } from '@react-navigation/native'

type Props = {
  items: ShopSummary[]
}

const ShopsSlider: React.FC<Props> = ({ items }: Props): React.ReactElement => {
  const navigation = useNavigation<NavigationType>()
  const ITEM_WIDTH = Dimensions.get('window').width

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        horizontal
        snapToOffsets={[...Array(items.length)].map(
          (x, i) => i * (ITEM_WIDTH - 30),
        )}
        snapToEnd={false}
        snapToAlignment={'center'}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        renderItem={({ item }: { item: ShopSummary }) => (
          <View style={{ flex: 1 }}>
            <ShopCard
              key={item.id}
              onPress={() => navigation.navigate('ShopDetail', { id: item.id })}
              item={item}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <Separator />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}
const Separator = styled.View`
  width: ${theme.spacing['2.5']};
`
export default ShopsSlider
