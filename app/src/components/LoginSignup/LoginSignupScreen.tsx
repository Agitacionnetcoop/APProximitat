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
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import Icon from '../common/Icon'
import { LoginSignupProps } from '../types'
import { lang } from '../../helpers/language'

const LoginSignupScreen = ({ navigation, route }: LoginSignupProps) => {
  const { formType } = route.params
  const { literals } = useStore.getState()
  const insets = useSafeAreaInsets()
  const [currentForm, setCurrentForm] = useState<'login' | 'signup'>(formType)
  const [signedEmail, setSignedEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    setCurrentForm(formType)
  }, [formType])

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
              paddingBottom: currentForm === 'login' ? '20%' : 0,
            }}
          >
            <Icon icon="logo" height={100} color={null} calculateWidth />
            <FormContainer>
              <Title>
                {currentForm === 'signup'
                  ? lang(literals[48])
                  : lang(literals[49])}
              </Title>
              {currentForm === 'signup' ? (
                <SignupForm
                  literals={literals}
                  toggleFormCallback={() => setCurrentForm('login')}
                  onSubmitCallback={email => {
                    if (email) {
                      setSignedEmail(email)
                    }
                    setCurrentForm('login')
                  }}
                />
              ) : (
                <LoginForm
                  literals={literals}
                  toggleFormCallback={() => setCurrentForm('signup')}
                  onSubmitCallback={() =>
                    navigation.navigate('Authentication', { code: undefined })
                  }
                  defaultEmail={signedEmail}
                />
              )}
            </FormContainer>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default LoginSignupScreen

const FormContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[6]};
  padding-vertical: ${theme.spacing[10]};
`
const Title = styled.Text`
  font-family: ${theme.fonts.interMedium};
  font-size: ${theme.fonts.size[20]};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
  padding-top: ${theme.spacing[4]};
`
