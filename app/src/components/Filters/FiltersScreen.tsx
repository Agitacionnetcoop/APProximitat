import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'
import { Switch } from 'react-native-switch'
import OverlayContainer from '../common/OverlayContainer'
import ButtonRounded from '../common/ButtonRounded'
import { useStore } from '../../store/useStore'
import { lang } from '../../helpers/language'
import { capitalize } from '../../helpers/capitalize'
import { FiltersProps } from '../types'

const FiltersScreen = ({ navigation, route }: FiltersProps) => {
  const { firstConfig } = route.params
  const { setFilters } = useStore()
  const { literals, filterOptions, filters } = useStore.getState()
  const [categoryFilters, setCategoryFilters] = useState<string[]>([
    ...filters.categories,
  ])
  const [sustainabilityFilters, setSustainabilityFilters] = useState<string[]>([
    ...filters.sustainability,
  ])

  const handleFilterCategories = (option: string, value: boolean) => {
    const currentFilters = [...categoryFilters]
    if (!value && currentFilters.includes(option)) {
      const indexOf = currentFilters.indexOf(option)
      currentFilters.splice(indexOf, 1)
    } else if (value && !currentFilters.includes(option)) {
      currentFilters.push(option)
    }
    setCategoryFilters(currentFilters)
  }

  const handleFilterSustainability = (option: string, value: boolean) => {
    const currentFilters = [...sustainabilityFilters]
    if (!value && currentFilters.includes(option)) {
      const indexOf = currentFilters.indexOf(option)
      currentFilters.splice(indexOf, 1)
    } else if (value && !currentFilters.includes(option)) {
      currentFilters.push(option)
    }
    setSustainabilityFilters(currentFilters)
  }

  useEffect(() => {
    if (firstConfig && filters.categories.length === 0) {
      const categories = filterOptions.categories.map(c => c.text['ca'])
      setCategoryFilters(categories)
    }
  }, [])

  return (
    <OverlayContainer
      customStyle={{
        paddingHorizontal: '15%',
        height: '100%',
      }}
      closeButton={!firstConfig}
      onClose={() => navigation.navigate('MainTab')}
      backgroundColor={
        firstConfig ? theme.colors.background : theme.colors.white
      }
    >
      <Container>
        <Title firstConfig={firstConfig}>{lang(literals[35])}</Title>
        <Section firstConfig={firstConfig}>
          {/* Sustainability filters */}
          {!firstConfig && <Subtitle>{lang(literals[36])}</Subtitle>}
          <Options>
            {filterOptions.sustainability.map(option => (
              <Option key={option.id}>
                <Label>{capitalize(lang(option.text))}</Label>
                <Switch
                  renderActiveText={false}
                  renderInActiveText={false}
                  circleActiveColor={theme.colors.purple}
                  backgroundActive={theme.colors.grayD9D9D9}
                  circleInActiveColor={theme.colors.gray96929E}
                  backgroundInactive={theme.colors.grayD9D9D9}
                  circleBorderWidth={0}
                  circleSize={firstConfig ? 24 : 20}
                  barHeight={firstConfig ? 24 : 20}
                  changeValueImmediately
                  onValueChange={value =>
                    handleFilterSustainability(option.text['ca'], value)
                  }
                  value={sustainabilityFilters.includes(option.text['ca'])}
                />
              </Option>
            ))}
          </Options>
        </Section>
        <Section firstConfig={firstConfig}>
          {/* Category filters */}
          {!firstConfig && <Subtitle>{lang(literals[37])}</Subtitle>}
          <Options>
            {filterOptions.categories.map(option => (
              <Option key={option.id}>
                <Label>{capitalize(lang(option.text))}</Label>
                <Switch
                  renderActiveText={false}
                  renderInActiveText={false}
                  circleActiveColor={theme.colors.purple}
                  backgroundActive={theme.colors.grayD9D9D9}
                  circleInActiveColor={theme.colors.gray96929E}
                  backgroundInactive={theme.colors.grayD9D9D9}
                  circleBorderWidth={0}
                  circleSize={firstConfig ? 24 : 20}
                  barHeight={firstConfig ? 24 : 20}
                  changeValueImmediately
                  onValueChange={value =>
                    handleFilterCategories(option.text['ca'], value)
                  }
                  value={categoryFilters.includes(option.text['ca'])}
                />
              </Option>
            ))}
          </Options>
        </Section>
        <ButtonContainer>
          <ButtonRounded
            label={firstConfig ? lang(literals[70]) : lang(literals[39])}
            onPress={() => {
              setFilters({
                categories: categoryFilters,
                sustainability: sustainabilityFilters,
              })
              navigation.navigate('MainTab')
            }}
          />
        </ButtonContainer>
      </Container>
    </OverlayContainer>
  )
}

export default FiltersScreen

const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-bottom: ${theme.spacing[32]};
`
const Title = styled.Text<{ firstConfig?: boolean }>`
  font-family: ${theme.fonts.notoSansBold};
  font-size: ${theme.fonts.size[24]};
  line-height: ${theme.fonts.height[32]};
  color: ${theme.colors.black};
  width: 100%;
  padding-bottom: ${({ firstConfig }) => (firstConfig ? theme.spacing[6] : 0)};
`
const Section = styled.View<{ firstConfig?: boolean }>`
  padding-vertical: ${({ firstConfig }) =>
    firstConfig ? theme.spacing[2] : theme.spacing[4]};
  width: 100%;
`
const Subtitle = styled.Text`
  font-family: ${theme.fonts.notoSansMedium};
  font-size: ${theme.fonts.size[18]};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
  padding-bottom: ${theme.spacing[2]};
`
const Label = styled.Text<{ firstConfig?: boolean }>`
  font-family: ${theme.fonts.notoSansRegular};
  font-size: ${({ firstConfig }) =>
    firstConfig ? theme.fonts.size[22] : theme.fonts.size[16]};
  line-height: ${({ firstConfig }) =>
    firstConfig ? theme.fonts.height[28] : theme.fonts.height[18]};
  color: ${theme.colors.black};
  padding-right: ${theme.spacing[2]};
`
const Options = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`
const Option = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: ${theme.spacing[1]};
`
const ButtonContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-top: ${theme.spacing[8]};
`
