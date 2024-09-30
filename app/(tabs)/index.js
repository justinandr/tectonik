import { Text, View } from 'react-native';
import { supabase } from '../../lib/supabase'
import { useState } from 'react';

export default function HomeScreen() {
  
  async function fetchData() {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
    
    data ? console.log(data) : console.log(error)
  }

  fetchData()

  
    return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
      >
      <Text>Home Screen</Text>
    </View>
  );
}
