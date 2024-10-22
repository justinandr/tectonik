import { View, Text, Button, YStack, Avatar, H2 } from 'tamagui'
import { CircleUser } from '@tamagui/lucide-icons'
import { supabase } from 'utils/supabase'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'

export default function Settings() {

  const [userName, setUserName] = useState<string>('')
  const [avatarUri, setAvatarUri] = useState<string>('')

  useEffect(() => {
    async function fetchUser() {
      const {data: { user }} = await supabase.auth.getUser()
      
      if (!user) {
        console.error('User is not authenticated')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching locations:', error)
        return
      }

      setUserName(data[0].name)

    }
    fetchUser()
  }, [])

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log('Error logging out:', error.message)
    }
  }

  return (
    <View height={'100%'} bg={'$background'}>
      <YStack f={1} ai={'center'} gap={'$3'} pt='$5'>
        {avatarUri ? 
        <Avatar circular size={'$10'}>
          <Avatar.Fallback bg={'$accentBackground'} />
        </Avatar>
        : <CircleUser strokeWidth={1} size={'$10'}  color={'$gray10'} />}
        {userName ? <H2>{userName}</H2> : null}
        <Button onPress={() => {}}  >Edit Account Info</Button>
        <Button onPress={signOut}>
          Sign Out
        </Button>
      </YStack>
    </View>
  )
}