import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'

import { Dimensions, View } from 'react-native'
import ButtonRounded from '../common/ButtonRounded'
import FormInput from '../common/FormInput'
import Cta from '../common/Cta'
import { useStore } from '../../store/useStore'
import { login } from '../../services/user.services'
import { LoginSchema } from '../../helpers/formValidations'
import { lang } from '../../helpers/language'
import FormError from '../common/FormError'

const LoginForm = ({
  literals,
  toggleFormCallback,
  onSubmitCallback,
}: {
  literals: Record<string, string>
  toggleFormCallback: () => void
  onSubmitCallback: () => void
}) => {
  const { setUser } = useStore()
  const { user } = useStore.getState()
  const [formError, setFormError] = useState<string | undefined>(undefined)

  const onSubmit = async (formValues: { email: string }) => {
    const response = await login(formValues)
    if (response.user) {
      setUser(response.user)
      onSubmitCallback()
    } else {
      if (response.message === 'No user found') {
        setFormError(lang(literals[64]))
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
      initialValues={{ email: user?.email || '' }}
      validationSchema={LoginSchema(literals)}
      onSubmit={values => onSubmit({ email: values.email })}
      validateOnBlur={false}
      validateOnChange={false}
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
            {formError && <FormError id="formError" message={formError} />}
            <ButtonRounded
              label={lang(literals[57])}
              onPress={handleSubmit}
              width={`${Dimensions.get('window').width - 40}px`}
              customContainerStyles={{ marginBottom: 20 }}
            />
            <Cta
              label={`${lang(literals[51])} ${lang(literals[48])}`}
              onPress={toggleFormCallback}
              arrow={false}
            />
          </View>
        )
      }}
    </Formik>
  )
}

export default LoginForm
