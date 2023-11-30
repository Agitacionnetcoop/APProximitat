import React, { useRef } from 'react'
import styled from 'styled-components/native'
import Icon from '../common/Icon'
import { StyleProp, TextInput, ViewStyle } from 'react-native/types'
import { searchShadow, theme } from '../../settings/theme'
import { useNavigation } from '@react-navigation/native'
import { useSearch } from '../../store/useStore'
import { NavigationType } from '../types'

type Props = {
  containerStyles?: StyleProp<ViewStyle>
  placeholder?: string
  placeholderTextColor?: string
  onPressIn?: (() => void) | undefined
  autoFocus?: boolean
}

const SearchBar = ({
  placeholder = '',
  placeholderTextColor = 'black',
  onPressIn,
  autoFocus = false,
}: Props) => {
  const navigation = useNavigation<NavigationType>()
  const ref = useRef<TextInput>(null)
  const { search, setSearch } = useSearch(({ search, setSearch }) => ({
    search,
    setSearch,
  }))

  const handleTextChange = (text: string) => {
    setSearch(text)
  }

  const handleResults = () => {
    if (search.length > 0) {
      navigation.navigate('Search', { searchValue: search })
    }
  }

  return (
    <SearchContainer onPress={() => ref.current?.focus()} style={searchShadow}>
      <Icon
        icon={'search'}
        color={'black'}
        height={12}
        width={12}
        customContainerStyles={{
          height: 30,
          width: 30,
        }}
      />
      <SearchInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onPressIn={onPressIn}
        autoFocus={autoFocus}
        value={search}
        onChangeText={text => handleTextChange(text)}
        onSubmitEditing={() => handleResults()}
        autoCorrect={false}
      />
    </SearchContainer>
  )
}

const SearchContainer = styled.Pressable`
  background-color: ${theme.colors.white};
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: ${theme.spacing[4]};
  padding-left: ${theme.spacing[1]};
  padding-right: ${theme.spacing[4]};
  height: 30px;
`
const SearchInput = styled.TextInput`
  flex: 1;
  color: black;
  height: 100%;
  width: 100%;
  padding: 0;
`
export default SearchBar
