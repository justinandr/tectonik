import { View, Text, Button } from 'tamagui'
import { supabase } from 'utils/supabase'

//A simple settings screen
export default function Settings() {

  //Sign out function
  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log('Error logging out:', error.message)
    }
  }
  return (
    <View flex={1} alignItems="center" justifyContent="center" bg="$background">
      <Text fontSize={20} color="$blue10">Settings</Text>
      <Button onPress={signOut} mt={20} variant="outlined" >
        Sign Out
      </Button>
    </View>
  )
}