import { Text, View } from 'react-native';
import React from 'react';
import { Button } from 'react-native';
import { supabase } from '@/lib/supabase'

export default function SettingsScreen() {

  async function signOut() {
    const { error } = await supabase.auth.signOut()
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text>Settings Screens</Text>
      <Button title='Sign Out' onPress={signOut}/>
    </View>
  );
}
