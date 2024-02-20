import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'

import { Dimensions, View } from 'react-native'
import ButtonRounded from '../common/ButtonRounded'
import FormInput from '../common/FormInput'
import Cta from '../common/Cta'
import { register } from '../../services/user.services'
import { useStore } from '../../store/useStore'
import { SignupSchema } from '../../helpers/formValidations'
import FormError from '../common/FormError'
import { lang } from '../../helpers/language'

const SignupForm = ({
  literals,
  toggleFormCallback,
  onSubmitCallback,
}: {
  literals: Record<string, string>
  toggleFormCallback: () => void
  onSubmitCallback: (email: string) => void
}) => {
  const { setUser } = useStore()
  const [formError, setFormError] = useState<string | undefined>(undefined)

  const onSubmit = async (formValues: { name: string; email: string }) => {
    const response = await register(formValues)
    if (response.user) {
      setUser(response.user)
      onSubmitCallback(formValues.email)
    } else {
      if (response.message === 'User already exists') {
        setFormError(lang(literals[63]))
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
      initialValues={{ name: '', email: '' }}
      validationSchema={SignupSchema(literals)}
      onSubmit={values => onSubmit({ name: values.name, email: values.email })}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ handleSubmit, values, setFieldValue, setFieldTouched, errors }) => {
        return (
          <View>
            <FormInput
              id="name"
              label={literals[26]}
              onChangeText={text => setFieldValue('name', text)}
              onBlur={() => setFieldTouched('name')}
              value={values.name}
              error={errors.name}
            />
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
              label={lang(literals[48])}
              onPress={handleSubmit}
              width={`${Dimensions.get('window').width - 40}px`}
              customContainerStyles={{ marginBottom: 20 }}
            />
            <Cta
              label={`${lang(literals[50])} ${lang(literals[49])}`}
              onPress={toggleFormCallback}
              arrow={false}
            />
          </View>
        )
      }}
    </Formik>
  )
}

export default SignupForm
