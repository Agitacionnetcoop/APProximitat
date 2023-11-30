import React from 'react'
import { theme } from '../../settings/theme'
import { styled } from 'styled-components/native'
import Tag from '../common/Tag'
import { TagItem } from '../types'
import { lang } from '../../helpers/language'

type Props = {
  tags: TagItem[]
  callback: (activityCatId: number) => void
  active?: number | null
}

const ActivityTags = ({ tags = [], callback, active }: Props) => {
  return (
    <Container
      horizontal
      contentContainerStyle={{
        paddingHorizontal: 20,
        width: '100%',
      }}
      showsHorizontalScrollIndicator={false}
    >
      {tags.map((tag, index) => (
        <Spacer key={String(index) + lang(tag.text)}>
          <Tag
            text={tag.text}
            onPress={() => callback(Number(tag.id))}
            invertColors={active === Number(tag.id)}
          />
        </Spacer>
      ))}
    </Container>
  )
}

const Container = styled.ScrollView`
  margin-bottom: ${theme.spacing[5]};
`
const Spacer = styled.View`
  margin-right: ${theme.spacing['1.5']};
`

export default ActivityTags
