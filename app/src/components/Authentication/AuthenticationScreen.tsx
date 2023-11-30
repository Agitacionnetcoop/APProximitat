import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { theme } from '../../settings/theme'

import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useStore } from '../../store/useStore'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AuthForm from './AuthForm'
import Icon from '../common/Icon'
import { AuthenticationProps } from '../types'
import { lang } from '../../helpers/language'
import Cta from '../common/Cta'

const AuthenticationScreen = ({ navigation, route }: AuthenticationProps) => {
  const { code } = route.params
  const { user } = useStore.getState()
  const { literals } = useStore.getState()
  const insets = useSafeAreaInsets()
  const [authCode, setAuthCode] = useState<string | undefined>(undefined)

  useEffect(() => {
    setAuthCode(code)
  }, [code])

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1 }}
      enabled
      keyboardVerticalOffset={insets.top + insets.bottom}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: theme.colors.background,
            maxHeight: Dimensions.get('window').height,
            flex: 1,
          }}
        >
          <View
            style={{
              minHeight: '80%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20%',
            }}
          >
            <Icon icon="logo" height={100} color={null} calculateWidth />
            <FormContainer>
              <>
                <Title>
                  {`${lang(literals[56])} `}
                  <Email>{user.email}</Email>
                </Title>
                <AuthForm
                  code={authCode}
                  literals={literals}
                  onSubmitCallback={() => navigation.navigate('ProfileOptions')}
                />
              </>
              <Cta
                label={lang(literals[58])}
                onPress={() =>
                  navigation.navigate('LoginSignup', { formType: 'login' })
                }
                arrow={false}
              />
            </FormContainer>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default AuthenticationScreen

const FormContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[6]};
  padding-vertical: ${theme.spacing[4]};
  padding-horizontal: ${theme.spacing[8]};
`
const Title = styled.Text`
  font-family: ${theme.fonts.interMedium};
  font-size: ${theme.fonts.size[16]};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
  padding-top: ${theme.spacing[4]};
  align-self: center;
  text-align: center;
`
const Email = styled.Text`
  font-family: ${theme.fonts.interSemiBold};
  text-transform: lowercase;
`
