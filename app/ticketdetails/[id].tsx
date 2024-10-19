import { View, Text } from 'tamagui'
import { useLocalSearchParams } from 'expo-router'
import ModalScreen from 'app/modal'
import { Modal } from 'react-native'

export default function ticketByID() {

  const { id } = useLocalSearchParams()

  return (
    <View flex={1} alignItems="center" justifyContent="center" bg="$background">
      <Text fontSize={20} color="$blue10">{id}</Text>
    </View>
  )
} 