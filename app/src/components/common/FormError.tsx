import React from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'

const FormError = ({ id, message }: { id: string; message: string }) => {
  return (
    <Container>
      <Message>{message}</Message>
    </Container>
  )
}

export default FormError

const Container = styled.View`
  display: flex;
  flex-direction: row;
  margin-bottom: ${theme.spacing[6]};
`
const Message = styled.Text`
  font-family: ${theme.fonts.interRegular};
  font-size: ${theme.fonts.size[14]};
  line-height: ${theme.fonts.height[14]};
  color: ${theme.colors.red};
`
