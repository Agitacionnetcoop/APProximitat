import React from 'react'
import { Share } from 'react-native'
import IconButton from './IconButton'
import { theme } from '../../settings/theme'
import { ErrorAlert } from '../../services/alerts'

type Props = {
  type: 'shop' | 'activity'
  id: number | string
}

const ShareButton: React.FC<Props> = ({
  id,
  type,
}: Props): React.ReactElement => {
  const url =
    type === 'shop'
      ? `http://m.approximitat.cat/iditem/${id}`
      : `http://m.approximitat.cat/idact/${id}`

  const handleShare = async () => {
    try {
      await Share.share(
        {
          message: url,
          url: url,
          title: 'APProximitat',
        },
        {
          dialogTitle: 'APProximitat',
        },
      )
    } catch (error: any) {
      ErrorAlert(error.message)
    }
  }

  return (
    <IconButton
      icon={'share'}
      color={theme.colors.white}
      backgroundColor={theme.colors.green}
      size={34}
      iconHeight={19}
      calculateWidth
      onPress={() => handleShare()}
    />
  )
}

export default ShareButton
