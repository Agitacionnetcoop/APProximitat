import React, { useState } from 'react'
import styled from 'styled-components/native'
import { Formik } from 'formik'

import { theme } from '../../settings/theme'

import { View } from 'react-native'
import ScreenContainer from '../common/ScreenContainer'
import { PersonalInfoProps } from '../types'
import ButtonRounded from '../common/ButtonRounded'
import FormInput from '../common/FormInput'
import { useStore } from '../../store/useStore'
import { deleteAccount, profile } from '../../services/user.services'
import { PersonalInfoSchema } from '../../helpers/formValidations'
import { lang } from '../../helpers/language'
import Cta from '../common/Cta'
import { ConfirmationAlert, SuccessAlert } from '../../services/alerts'

const PersonalInfoScreen = ({ navigation, route }: PersonalInfoProps) => {
  const { literals, user } = useStore.getState()
  const { email, name, data } = user
  const { setUser, setToken, setFavorites, setFilters } = useStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = async (formData: { name: string; email: string }) => {
    setLoading(true)
    const response = await profile(formData)
    if (response) {
      setUser({ ...response, data: data })
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    }
    setLoading(false)
  }

  const handleDeleteUser = () => {
    ConfirmationAlert(
      literals[84],
      literals[83],
      literals[84],
      literals[85],
      async () => {
        const response = await deleteAccount()
        if (response.deleted) {
          SuccessAlert(literals[86], () => {
            setUser({})
            setToken('')
            setFavorites([])
            setFilters({ categories: [], sustainability: [] })
            navigation.navigate('LoginSignup', { formType: 'signup' })
          })
        }
      },
    )
  }

  return (
    <ScreenContainer>
      <FormContainer>
        <Title>{literals[8]}</Title>
        <Formik
          initialValues={{ name, email }}
          onSubmit={values => handleSubmit(values)}
          validationSchema={PersonalInfoSchema(literals)}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({
            handleSubmit,
            values,
            setFieldValue,
            setFieldTouched,
            errors,
          }) => {
            return (
              <View>
                <FormInput
                  id="name"
                  label={literals[26]}
                  onChangeText={text => setFieldValue('name', text)}
                  onBlur={() => setFieldTouched('name')}
                  value={values.name}
                  error={errors.name as string}
                />
                <FormInput
                  id="email"
                  label={literals[27]}
                  onChangeText={text => setFieldValue('email', text)}
                  onBlur={() => setFieldTouched('email')}
                  value={values.email}
                  error={errors.email as string}
                  editable={false}
                />
                <SubmitContainer>
                  <ButtonRounded
                    label={literals[9]}
                    onPress={handleSubmit}
                    loading={loading}
                    width={'30%'}
                  />
                  {submitted && (
                    <SubmittedMessage>{lang(literals[42])}</SubmittedMessage>
                  )}
                </SubmitContainer>
              </View>
            )
          }}
        </Formik>
      </FormContainer>
      <Description>{literals[68]}</Description>
      <Cta
        label={literals[82]}
        onPress={() => handleDeleteUser()}
        arrow={false}
        color={theme.colors.green}
      />
    </ScreenContainer>
  )
}

export default PersonalInfoScreen

const FormContainer = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
  padding-top: ${theme.spacing[12]};
  padding-bottom: ${theme.spacing[16]};
`
const Title = styled.Text`
  font-family: ${theme.fonts.interMedium};
  font-size: ${theme.fonts.size[20]};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
`
const Description = styled.Text`
  font-family: ${theme.fonts.interMedium};
  font-size: ${theme.fonts.size[16]};
  line-height: ${theme.fonts.height[24]};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing[10]};
`
const SubmitContainer = styled.View`
  position: relative;
`
const SubmittedMessage = styled.Text`
  position: absolute;
  color: ${theme.colors.green};
  font-size: ${theme.fonts.size[14]};
  bottom: -${theme.spacing[7]};
`
