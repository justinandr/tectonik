import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name='[id]' options={{headerShown: false, title: 'Ticket Details'}}/>
    </Stack>
  )
}

export default _layout