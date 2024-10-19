import { Stack } from 'expo-router'

const TicketDetailLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='[id]' options={{headerShown: true, title: 'Ticket Details'}}/>
    </Stack>
  )
}

export default TicketDetailLayout