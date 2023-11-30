import React from 'react'
import { styled } from 'styled-components/native'
import { StyleProp, ViewStyle, Linking } from 'react-native'

import { theme } from '../../settings/theme'

import IconButton from './IconButton'
import { ErrorAlert } from '../../services/alerts'
import { Channel } from '../types'

const RRSSS = ({
  containerStyle,
  phone,
  email,
  channels,
}: {
  containerStyle?: StyleProp<ViewStyle> | any
  phone?: string
  email?: string
  channels?: Channel[]
}) => {
  const formattedPhone =
    phone && ['6', '7'].includes(phone.charAt(0)) ? phone : undefined

  return (
    <Container style={containerStyle}>
      {formattedPhone && (
        <IconButton
          onPress={() =>
            Linking.openURL(`whatsapp://send?phone=${formattedPhone}`)
              .then()
              .catch((err: any) => {
                return ErrorAlert(err.error)
              })
          }
          icon="whatsapp"
          iconHeight={28}
          calculateWidth
          color={null}
        />
      )}
      {email && (
        <IconButton
          onPress={() =>
            Linking.openURL(`mailto:${email}`)
              .then()
              .catch((err: any) => {
                return ErrorAlert(err.error)
              })
          }
          icon="email"
          iconHeight={28}
          calculateWidth
          color={null}
        />
      )}
      {channels &&
        channels?.length > 0 &&
        channels.map(item => (
          <IconButton
            key={item.id}
            onPress={() =>
              Linking.openURL(`${item.value}`)
                .then()
                .catch((err: any) => {
                  return ErrorAlert(err.error)
                })
            }
            src={item.icon}
            iconHeight={28}
            iconWidth={28}
          />
        ))}
    </Container>
  )
}

export default RRSSS

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing[2]};
`
