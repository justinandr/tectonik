//A simple login screen
import { View, Text } from 'tamagui'

export default function Login() {
  return (
    <View flex={1} alignItems="center" justifyContent="center" bg="$background">
      <Text fontSize={20} color="$blue10">Login</Text>
    </View>
  )
}