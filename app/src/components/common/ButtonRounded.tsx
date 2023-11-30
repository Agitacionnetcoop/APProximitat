import React, { Fragment } from 'react'
import styled from 'styled-components/native'
import { theme } from '../../settings/theme'
import { StyleProp, ViewStyle } from 'react-native/types'
import Icon from './Icon'
import { Icons } from '../../helpers/resolver'
import Loader from './Loader'

type Props = {
  label: string
  onPress: () => void
  color?: string
  labelColor?: string
  disabled?: boolean
  width?: string | undefined
  customContainerStyles?: StyleProp<ViewStyle>
  icon?: Icons
  loading?: boolean
}

const ButtonRounded = ({
  label,
  onPress,
  color = theme.colors.green,
  labelColor = theme.colors.white,
  disabled = false,
  customContainerStyles = false,
  width,
  icon,
  loading = false,
}: Props) => {
  return (
    <ButtonContainer
      onPress={onPress}
      color={color}
      disabled={disabled}
      width={width}
      style={customContainerStyles}
    >
      {loading ? (
        <Loader color={labelColor} />
      ) : (
        <Fragment>
          {icon && (
            <Icon
              icon={icon}
              color={labelColor}
              height={25}
              calculateWidth
              customStyles={{ marginRight: 10 }}
            />
          )}
          <Label labelColor={labelColor} disabled={disabled}>
            {label}
          </Label>
        </Fragment>
      )}
    </ButtonContainer>
  )
}

export default ButtonRounded

const ButtonContainer = styled.TouchableOpacity<{
  color: string
  disabled: boolean
  width: string | undefined
}>`
  display: flex;
  background-color: ${({ color, disabled }) =>
    disabled ? theme.colors.grayD9D9D9 : color};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  padding-vertical: ${theme.spacing['2.5']};
  padding-horizontal: ${theme.spacing['2.5']};
  width: ${({ width }) => (width ? width : 'auto')};
`

const Label = styled.Text<{ labelColor: string; disabled: boolean }>`
  font-family: ${theme.fonts.notoSansMedium};
  font-size: ${theme.fonts.size[14]};
  line-height: 20px;
  color: ${({ labelColor, disabled }) =>
    disabled ? theme.colors.green : labelColor};
`
