import React from 'react'
import styled from 'styled-components/native'
import { theme } from '../../settings/theme'
import Icon from './Icon'

import { Icons } from '../../helpers/resolver'
import { ShopStatus } from '../../helpers/shopOpenStatus'
import { TouchableOpacity } from 'react-native'

type Props = Pick<ShopStatus, 'status' | 'statusText'> & {
  icon: Icons
  text: string
  onPress?: () => void
}

const InfoRow = ({ icon, text, statusText, status, onPress }: Props) => {
  return (
    <Row>
      <Icon
        icon={icon}
        height={14}
        calculateWidth
        color="black"
        customContainerStyles={{ marginTop: 3 }}
      />
      <TextRow>
        {status && statusText && <Text status={status}>{statusText}</Text>}
        {onPress ? (
          <TouchableOpacity onPress={onPress}>
            <Text isLink={true}>{text}</Text>
          </TouchableOpacity>
        ) : (
          <Text>{text}</Text>
        )}
      </TextRow>
    </Row>
  )
}

const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${theme.spacing[2]};
`

const TextRow = styled.View`
  flex-direction: row;
  align-items: center;
`

const Text = styled.Text<{
  status?: 'open' | 'closed'
  isLink?: boolean
}>`
  line-height: ${theme.fonts.height[20]};
  font-size: ${theme.fonts.size[14]};
  font-family: ${({ status }) =>
    status === 'closed'
      ? theme.fonts.notoSansMedium
      : theme.fonts.notoSansRegular};
  color: ${({ status }) =>
    status === 'closed' ? theme.colors.red : theme.colors.black};
  text-decoration: ${({ isLink }) => (isLink ? 'underline' : 'none')};
`
export default InfoRow
