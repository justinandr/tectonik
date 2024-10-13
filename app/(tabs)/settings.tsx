import { View, Text } from 'tamagui'

//A simple settings screen
export default function Settings() {
  return (
    <View flex={1} alignItems="center" justifyContent="center" bg="$background">
      <Text fontSize={20} color="$blue10">Settings</Text>
    </View>
  )
}