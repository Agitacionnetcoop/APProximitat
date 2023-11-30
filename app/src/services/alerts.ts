import { Alert } from 'react-native'

export const ErrorAlert = (errorMessage: string) => {
  return Alert.alert(
    'Error',
    errorMessage,
    [{ text: 'OK', onPress: () => {}, style: 'cancel' }],
    { cancelable: false },
  )
}

export const ConfirmationAlert = (title: string, message: string, accept: string, cancel: string, onPressAccept: () => void) => {
  return Alert.alert(
    title,
    message,
    [
      { text: cancel, onPress: () => {}, style: 'cancel'},
      {text: accept, onPress: () => onPressAccept(), style: 'destructive'},
    ],
    { cancelable: false },
  )
}

export const SuccessAlert = (message: string, onPress: () => void) => {
  return Alert.alert(
    '',
    message,
    [{ text: 'OK', onPress: () => onPress(), style: 'cancel' }],
    { cancelable: false },
  )
}
