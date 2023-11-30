import React from 'react'
import { Pressable } from 'react-native'
import Icon from './Icon'
import { styled } from 'styled-components/native'
import { theme } from '../../settings/theme'

type Props = {
  label: string
  onPress: () => void | Promise<void>
  color?: string | undefined
  hitSlop?: number
  arrow?: boolean
}

const Cta: React.FC<Props> = ({
  label,
  onPress,
  color,
  hitSlop = 0,
  arrow = true,
}: Props): React.ReactElement => {
  return (
    <Pressable hitSlop={hitSlop} onPress={() => onPress()}>
      <Container>
        <Label color={color}>{label}</Label>
        {arrow && <Icon icon="go" color="black" height={10} calculateWidth />}
      </Container>
    </Pressable>
  )
}

const Container = styled.View`
  display: flex;
  flex-direction: row;
  gap: ${theme.spacing[2]};
  align-items: center;
`
const Label = styled.Text<{ color?: string | undefined }>`
  font-family: ${theme.fonts.notoSansSemiBold};
  color: ${({ color }) => (color ? color : theme.colors.black)};
  font-size: ${theme.fonts.size[14]};
  line-height: ${theme.fonts.height[20]};
`
export default Cta
