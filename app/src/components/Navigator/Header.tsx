import React from 'react'
import styled from 'styled-components/native'
import SearchBar from '../common/SearchBar'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { theme } from '../../settings/theme'
import { useNavigation } from '@react-navigation/native'
import IconButton from '../common/IconButton'
import Icon from '../common/Icon'
import ShareButton from '../common/ShareButton'
import { NavigationType } from '../types'
import { useNotifications } from '../../store/useStore'

type Header = {
  searchBar?: boolean
  notificationsAndFilters?: boolean
  backButton?: boolean
  shareButton?: number | string | undefined
  shareButtonType?: 'shop' | 'activity'
}

const Header = ({
  searchBar = true,
  notificationsAndFilters = true,
  backButton = false,
  shareButton = undefined,
  shareButtonType = 'shop',
}: Header) => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationType>()
  const { notifications } = useNotifications(({ notifications }) => ({
    notifications,
  }))

  return (
    <Container>
      <TitleContainer paddingTop={insets.top}>
        <ButtonPlaceholder>
          {backButton && (
            <IconButton
              icon={'arrow'}
              color={theme.colors.white}
              backgroundColor={theme.colors.green}
              size={34}
              iconHeight={15}
              calculateWidth
              onPress={() => navigation.goBack()}
            />
          )}
        </ButtonPlaceholder>
        <Icon icon={'logo'} height={53} width={53} color={null} />
        <ButtonPlaceholder>
          {shareButton && (
            <ShareButton id={shareButton} type={shareButtonType} />
          )}
        </ButtonPlaceholder>
      </TitleContainer>
      <Row>
        {searchBar && <SearchBar />}
        {notificationsAndFilters && (
          <ButtonsContainer>
            <IconButton
              icon={'notification'}
              color={theme.colors.black}
              iconHeight={23}
              calculateWidth
              notification={notifications > 0}
              onPress={() => navigation.navigate('Notifications')}
            />
            <IconButton
              icon={'settings'}
              color={theme.colors.black}
              iconHeight={22}
              calculateWidth
              onPress={() =>
                navigation.navigate('Filters', { firstConfig: false })
              }
            />
          </ButtonsContainer>
        )}
      </Row>
    </Container>
  )
}

const Container = styled.View`
  background-color: ${theme.colors.background};
  padding-top: ${theme.spacing['1.5']};
  padding-bottom: ${theme.spacing[4]};
  width: 100%;
`
const TitleContainer = styled.View<{ paddingTop: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: ${theme.spacing['2.5']};
  padding-top: ${({ paddingTop }) => paddingTop}px;
  padding-horizontal: ${theme.spacing[5]};
`
const ButtonPlaceholder = styled.View`
  width: 34px;
`
const Row = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-horizontal: ${theme.spacing[5]};
  gap: ${theme.spacing[8]};
`
const ButtonsContainer = styled.View`
  flex-direction: row;
  gap: ${theme.spacing[4]};
  align-items: center;
  justify-content: flex-end;
`
export default Header
