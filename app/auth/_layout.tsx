import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false, title: 'Login'}}/>
    </Stack>
  )
}

export default _layout