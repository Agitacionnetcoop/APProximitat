import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'

import { Dimensions, View } from 'react-native'
import ButtonRounded from '../common/ButtonRounded'
import FormInput from '../common/FormInput'
import { useStore } from '../../store/useStore'
import { authUser } from '../../services/user.services'
import { AuthUserSchema } from '../../helpers/formValidations'
import { lang } from '../../helpers/language'
import FormError from '../common/FormError'
import { OneSignal } from 'react-native-onesignal'

const AuthForm = ({
  literals,
  onSubmitCallback,
  code,
}: {
  literals: Record<string, string>
  onSubmitCallback: () => void
  code?: string
}) => {
  const { setUser, setToken } = useStore()
  const { user } = useStore.getState()
  const [formError, setFormError] = useState<string | undefined>(undefined)

  const onSubmit = async (formValues: { email: string; code: string }) => {
    const subscriptionId =
      OneSignal.User.pushSubscription.getPushSubscriptionId()
    const response = await authUser({ ...formValues, playerId: subscriptionId })
    if (response.token) {
      setUser(response.user)
      setToken(response.token)
      onSubmitCallback()
    } else {
      if (response.message === 'Invalid code or email') {
        setFormError(lang(literals[61]))
      } else if (response.message === 'User not verified') {
        setFormError(lang(literals[62]))
      } else {
        setFormError(response.message)
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setFormError(undefined)
    }, 15000)
  }, [formError])

  return (
    <Formik
      initialValues={{ email: user.email || '', code: code || '' }}
      validationSchema={AuthUserSchema(literals)}
      onSubmit={values => onSubmit({ email: values.email, code: values.code })}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize
    >
      {({ handleSubmit, values, setFieldValue, setFieldTouched, errors }) => {
        return (
          <View>
            <FormInput
              id="email"
              label={literals[27]}
              onChangeText={text => setFieldValue('email', text)}
              onBlur={() => setFieldTouched('email')}
              value={values.email}
              error={errors.email}
            />
            <FormInput
              id="code"
              label={lang(literals[55])}
              onChangeText={text => setFieldValue('code', text)}
              onBlur={() => setFieldTouched('code')}
              value={values.code}
              error={errors.code}
            />
            {formError && <FormError id="formError" message={formError} />}
            <ButtonRounded
              label={lang(literals[49])}
              onPress={handleSubmit}
              width={`${Dimensions.get('window').width - 40}px`}
              customContainerStyles={{ marginBottom: 20 }}
            />
          </View>
        )
      }}
    </Formik>
  )
}

export default AuthForm
