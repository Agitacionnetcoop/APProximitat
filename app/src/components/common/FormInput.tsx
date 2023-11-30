import React from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'
import FormError from './FormError'

const FormInput = ({
  id,
  label,
  onChangeText,
  onBlur,
  value,
  error,
  editable = true,
}: {
  id: string
  label?: string
  value: string
  error?: string
  editable?: boolean
  onChangeText: (text: string) => void
  onBlur: () => void
}) => {
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <Input
        id={id}
        onChangeText={(text: string) => onChangeText(text)}
        onBlur={onBlur}
        value={value}
        autoCapitalize="none"
        autoCorrect={false}
        editable={editable}
      />
      <Line />
      {error && <FormError id={id} message={error} />}
    </InputContainer>
  )
}

export default FormInput

const InputContainer = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`
const Label = styled.Text`
  font-family: ${theme.fonts.interRegular};
  font-size: ${theme.fonts.size[16]};
  line-height: ${theme.fonts.height[20]};
  color: ${theme.colors.gray949494};
`
const Input = styled.TextInput<{ editable?: boolean }>`
  color: ${({ editable }) =>
    editable ? theme.colors.black : theme.colors.gray949494};
  font-family: ${theme.fonts.interMedium};
  line-height: ${theme.fonts.height[22]};
  font-size: ${theme.fonts.size[18]};
`
const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${theme.colors.green};
  margin-bottom: ${theme.spacing[6]};
`
