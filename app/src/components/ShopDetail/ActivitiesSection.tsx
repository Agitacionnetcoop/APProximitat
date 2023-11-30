import React from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'
import SectionTitle from '../common/SectionTitle'
import { Activity, NavigationType } from '../types'
import ActivityCard from '../Activities/ActivityCard'
import { useNavigation } from '@react-navigation/native'
import { Dimensions, FlatList, View } from 'react-native'

type Props = {
  shopName: string
  activities: Activity[]
  literals: Record<string, string>
}
const ActivitiesSection = ({ shopName, activities, literals }: Props) => {
  const navigation = useNavigation<NavigationType>()
  const ITEM_WIDTH = Dimensions.get('window').width

  return (
    <>
      <Container>
        <SectionTitle text={`${literals[88]} ${shopName}`} />
      </Container>
      <View style={{ flex: 1, paddingBottom: 20 }}>
        <FlatList
          data={activities}
          horizontal
          snapToOffsets={[...Array(activities.length)].map(
            (x, i) =>
              i * (ITEM_WIDTH * (activities.length === 1 ? 1 : 0.8) - 30),
          )}
          snapToEnd={false}
          snapToAlignment={'center'}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: activities.length === 1 ? 10 : 50,
          }}
          renderItem={({ item }: { item: Activity }) => (
            <View
              style={{
                flex: 1,
                width: ITEM_WIDTH * (activities.length === 1 ? 1 : 0.8) - 40,
              }}
            >
              <ActivityCard
                key={item.id}
                item={item}
                onPress={() =>
                  navigation.navigate('ActivityDetail', { id: item.id })
                }
                buttonLabel={literals[13]}
                complete={false}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <Separator />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </>
  )
}

const Container = styled.View`
  padding-top: ${theme.spacing['2.5']};
  padding-horizontal: ${theme.spacing[5]};
  padding-bottom: ${theme.spacing[8]};
`
const Separator = styled.View`
  width: ${theme.spacing['2.5']};
`

export default ActivitiesSection
