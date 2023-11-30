import React from 'react'
import { styled } from 'styled-components/native'
import { StyleProp, ViewStyle } from 'react-native'
import { theme, shadow } from '../../settings/theme'
import Image from '../common/Image'
import { Activity } from '../types'
import InfoRow from '../common/InfoRow'
import ButtonRounded from '../common/ButtonRounded'
import { fromDateToDate } from '../../helpers/fromDateToDate'

type Props = {
  item: Activity
  customContainerStyles?: StyleProp<ViewStyle> | any
  onPress: () => void
  buttonLabel: string
  complete?: boolean
}

const ActivityCard: React.FC<Props> = ({
  onPress,
  item,
  customContainerStyles = {},
  buttonLabel,
  complete = true,
}: Props): React.ReactElement => {
  const dateHour =
    item.date_initial || item.date_final
      ? fromDateToDate(item.date_initial, item.date_final)
      : null

  return (
    <Container
      style={{ ...customContainerStyles, ...shadow }}
      onPress={onPress}
    >
      <Image image={item.image} height={156} />
      <ContentContainer>
        {item.title && (
          <TitleContainer>
            <Title>{item.title}</Title>
          </TitleContainer>
        )}
        {dateHour?.date && <InfoRow icon={'calendar'} text={dateHour.date} />}
        {(item.via || item.num || item.cp) && (
          <InfoRow
            icon={'location'}
            text={`${item.via} ${item.num}, ${item.cp}`}
          />
        )}
        {item.email && <InfoRow icon={'email_icon'} text={item.email} />}
        {item.phone && <InfoRow icon={'phone'} text={item.phone} />}
        {dateHour?.hour && <InfoRow icon="clock" text={dateHour.hour} />}
        {item.body && complete && (
          <Description numberOfLines={4} ellipsizeMode="tail">
            {item.body}
          </Description>
        )}
        <ButtonContainer>
          <ButtonRounded label={buttonLabel} onPress={onPress} />
        </ButtonContainer>
      </ContentContainer>
    </Container>
  )
}
const Container = styled.TouchableOpacity`
  background-color: ${theme.colors.white};
  padding-bottom: ${theme.spacing[5]};
  margin-bottom: ${theme.spacing[2]};
`
const ContentContainer = styled.View`
  padding-horizontal: ${theme.spacing[3]};
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
  max-height: 100%;
`
const TitleContainer = styled.View`
  flex-direction: row;
  padding-top: ${theme.spacing[3]};
`
const Title = styled.Text`
  font-size: ${theme.fonts.size[18]};
  line-height: ${theme.fonts.height[22]};
  font-family: ${theme.fonts.merriweatherBlack};
  color: ${theme.colors.black};
`
const Description = styled.Text`
  padding-top: ${theme.spacing[4]};
  padding-bottom: ${theme.spacing[8]};
  font-size: ${theme.fonts.size[14]};
  line-height: ${theme.fonts.height[20]};
  color: ${theme.colors.black};
`
const ButtonContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-top: ${theme.spacing[4]};
`
export default ActivityCard
