import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false, title: 'Login'}}/>
    </Stack>
  )
}

export default AuthLayout