// @flow

import React from 'react'
import { theme } from '../../settings/theme'
import { styled } from 'styled-components/native'
import Tag from '../common/Tag'
import { Category, NavigationType, TagItem, TranslatableText } from '../types'
import { useNavigation } from '@react-navigation/native'

type TagType = 'sustainability' | 'tag'

type Props = {
  tags: TagItem[]
  sustainabilityTags: TagItem[]
  limit?: number
}

const ShopTags = ({ tags = [], sustainabilityTags = [], limit }: Props) => {
  const navigation = useNavigation<NavigationType>()

  const sustainabilityTagsWithType = sustainabilityTags.map(tag =>
    Object.assign(tag, {
      type: 'sustainability' as TagType,
    }),
  )
  const tagsWithType = tags.map(tag =>
    Object.assign(tag, {
      type: 'tag' as TagType,
    }),
  )

  const allTags = limit
    ? [...sustainabilityTagsWithType, ...tagsWithType].slice(0, limit)
    : [...sustainabilityTagsWithType, ...tagsWithType]

  const filterShops = ({
    id,
    text,
    type,
  }: {
    id: string
    text: TranslatableText
    type: TagType
  }): void => {
    const category: Category = { id: Number(id), name: text, shops: [] }
    navigation.navigate('ShopsCategory', {
      item: category,
      type: type,
    })
  }

  return (
    <Container>
      {allTags.map(tag => (
        <Tag
          invertColors={tag.type === 'sustainability'}
          key={`${tag.id}-${tag.type}`}
          text={tag.text}
          onPress={() => filterShops(tag)}
        />
      ))}
    </Container>
  )
}
const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${theme.spacing['2.5']};
`
export default ShopTags
