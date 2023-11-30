import React, { useState } from 'react'
import {
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native'

import Image from './Image'
import FavoriteButton from './FavoriteButton'
import IconButton from './IconButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  items: string[]
  shopId: number
}

const ImageSlider: React.FC<Props> = ({
  items,
  shopId,
}: Props): React.ReactElement => {
  const [currentImage, setCurrentImage] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const insets = useSafeAreaInsets()

  const handleOpenPreview = (index: number) => {
    setCurrentImage(index)
    setModalVisible(true)
  }

  return (
    <>
      <View>
        {items.length > 0 ? (
          <FlatList
            data={items}
            horizontal
            snapToInterval={Dimensions.get('window').width}
            snapToAlignment={'center'}
            decelerationRate="fast"
            renderItem={({ item, index }: { item: string; index: number }) => (
              <TouchableOpacity onPress={() => handleOpenPreview(index)}>
                <Image
                  key={item + String(index)}
                  height={170}
                  width={Dimensions.get('window').width}
                  image={item}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <TouchableOpacity onPress={() => handleOpenPreview(0)}>
            <Image image={''} height={170} favoriteButton shopId={shopId} />
          </TouchableOpacity>
        )}
        <FavoriteButton shopId={shopId} />
      </View>
      <Modal
        transparent
        visible={modalVisible}
        presentationStyle="overFullScreen"
        statusBarTranslucent
        supportedOrientations={[
          'portrait',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
      >
        <View
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            position: 'relative',
            width: '100%',
            height: Dimensions.get('window').height,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              position: 'absolute',
              zIndex: 10,
              right: 5,
              top: insets.top,
            }}
          >
            <IconButton
              onPress={() => setModalVisible(false)}
              icon="cross"
              iconHeight={20}
              calculateWidth
              color={'white'}
              customStyle={{
                padding: 15,
              }}
            />
          </View>
          <FlatList
            data={items}
            horizontal
            snapToInterval={Dimensions.get('window').width}
            snapToAlignment="center"
            decelerationRate="fast"
            getItemLayout={(data, index) => ({
              length: Dimensions.get('window').width,
              offset: Dimensions.get('window').width * index,
              index: index,
            })}
            initialScrollIndex={currentImage}
            style={{ flex: 2 }}
            renderItem={({ item, index }: { item: string; index: number }) => (
              <Image
                key={item + String(index)}
                image={item}
                height="auto"
                width={Dimensions.get('window').width}
                resizeMode="contain"
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </Modal>
    </>
  )
}

export default ImageSlider
