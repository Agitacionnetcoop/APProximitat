import React, { useState } from 'react'
import { styled } from 'styled-components/native'
import IconButton from './IconButton'
import { theme } from '../../settings/theme'
import { getFavorites, toggleFavorites } from '../../services/user.services'
import { useStore } from '../../store/useStore'
import { useNavigation } from '@react-navigation/native'
import { NavigationType } from '../types'

type Props = {
  shopId: number
}

const FavoriteButton: React.FC<Props> = ({
  shopId,
}: Props): React.ReactElement => {
  const navigation = useNavigation<NavigationType>()
  const { token, setFavorites, favorites } = useStore()
  const isFavorite = favorites.some(fav => fav.id === shopId)
  const [loading, setLoading] = useState<boolean>(false)

  const updateUserFavorites = async () => {
    const response = await getFavorites()
    if (response) {
      setFavorites(response)
    }
    setLoading(false)
  }

  const toggleFavorite = async () => {
    setLoading(true)
    const response = await toggleFavorites(shopId)
    if (typeof response === 'boolean') {
      updateUserFavorites()
    }
  }

  return (
    <Container>
      <IconButton
        icon={isFavorite ? 'full_heart' : 'heart'}
        backgroundColor={theme.colors.grayD9D9D9}
        borderColor={theme.colors.black}
        size={28}
        loading={loading}
        loadingColor="black"
        color={isFavorite ? theme.colors.red : theme.colors.black}
        onPress={
          token?.length > 0
            ? () => toggleFavorite()
            : () => navigation.navigate('Profile')
        }
        iconHeight={13}
        iconWidth={15}
      />
    </Container>
  )
}

const Container = styled.View`
  position: absolute;
  top: ${theme.spacing[4]};
  right: ${theme.spacing[4]};
`
export default FavoriteButton
