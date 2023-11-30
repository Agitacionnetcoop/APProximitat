import React, { Fragment, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'
import ShopsSlider from './ShopsSlider'
import Cta from '../common/Cta'
import { lang } from '../../helpers/language'
import ScreenContainer from '../common/ScreenContainer'
import { getCategories } from '../../services/data.services'
import { AllShopsProps, Category } from '../types'
import { useStore } from '../../store/useStore'
import { Dimensions } from 'react-native'

const AllShopsScreen = ({ navigation }: AllShopsProps) => {
  const { literals, filterOptions } = useStore.getState()
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { filters } = useStore(({ filters }) => ({
    filters,
  }))

  const loadData = async () => {
    setLoading(true)
    const response = await getCategories({
      sustainabilityNames: filters.sustainability,
      categoryNames: filters.categories,
    })
    if (response) {
      setData(response)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [filters])

  return (
    <ScreenContainer paddingHorizontal={0} loadingContent={loading}>
      {data.map(category => {
        const translatableCategoryName = filterOptions.categories.find(
          cat => cat.id === category.id,
        )?.text

        if (translatableCategoryName) {
          Object.assign(category, { name: translatableCategoryName })
        }

        return (
          <Fragment key={category.id}>
            <TitleContainer>
              <Title numberOfLines={1} ellipsizeMode="tail">
                {lang(category.name)}
              </Title>
              <Cta
                label={literals[22]}
                onPress={() =>
                  navigation.navigate('ShopsCategory', {
                    item: category,
                    type: 'category',
                  })
                }
              />
            </TitleContainer>
            <ShopsSlider items={category.shops} key={category.id} />
          </Fragment>
        )
      })}
    </ScreenContainer>
  )
}

const TitleContainer = styled.View`
  flex-direction: row;
  padding-top: ${theme.spacing[4]};
  padding-bottom: ${theme.spacing['2.5']};
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${theme.spacing[5]};
  gap: ${theme.spacing[4]};
`
const Title = styled.Text`
  font-size: ${theme.fonts.size[24]};
  line-height: ${theme.fonts.height[32]};
  font-family: ${theme.fonts.notoSansBold};
  max-width: ${Dimensions.get('window').width * 0.65}px;
  color: ${theme.colors.black};
`
export default AllShopsScreen
