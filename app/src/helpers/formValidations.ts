import * as Yup from 'yup'
import { lang } from './language'

export const LoginSchema = (literals: Record<string, string>) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(lang(literals[59]))
      .required(lang(literals[60])),
  })}

export const AuthUserSchema = (literals: Record<string, string>) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(lang(literals[59]))
      .required(lang(literals[60])),
    code: Yup.string()
      .min(4, lang(literals[61]))
      .max(4, lang(literals[61]))
      .required(lang(literals[60])),
  })}

export const SignupSchema = (literals: Record<string, string>) => {
  return Yup.object().shape({
    name: Yup.string().required(lang(literals[60])),
    email: Yup.string()
      .email(lang(literals[59]))
      .required(lang(literals[60])),
  })}

export const PersonalInfoSchema = (literals: Record<string, string>) => {
  return Yup.object().shape({
    name: Yup.string().required(lang(literals[60])),
    email: Yup.string()
      .email(lang(literals[59]))
      .required(lang(literals[60])),
  })}
