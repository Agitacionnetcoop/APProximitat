import React from 'react'
import { shadow, theme } from '../../settings/theme'
import styled from 'styled-components/native'
import Icon from '../common/Icon'
import { lang } from '../../helpers/language'
import { useStore } from '../../store/useStore'

const NoResultsFound: React.FC = () => {
  const { literals } = useStore.getState()
  return (
    <Container style={shadow}>
      <Icon icon="noResults" height={355} calculateWidth color={null} />
      <Description>{lang(literals[40])}</Description>
    </Container>
  )
}

const Container = styled.View`
  background-color: ${theme.colors.white};
  padding: ${theme.spacing[4]};
`
const Description = styled.Text`
  font-family: ${theme.fonts.notoSansRegular};
  font-size: ${theme.fonts.size[22]};
  line-height: ${theme.fonts.height[28]};
  text-align: center;
  padding-bottom: ${theme.spacing[6]};
  color: ${theme.colors.black};
`

export default NoResultsFound
