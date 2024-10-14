import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { supabase } from 'utils/supabase'
import { Button, Input, Form, Label, H2 } from 'tamagui'

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <Form
      f={1} 
      ai={'stretch'} 
      gap="$2" 
      px="$6" 
      pt="$20" 
      bg="$background"
    >
      <H2>Sign In</H2>
      <Label htmlFor='email' fontWeight='bold'>Email</Label>
      <Input
        id='email'
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize={'none'}
      />
      <Label htmlFor='password' fontWeight='bold'>Password</Label>
      <Input
        id='password'
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize={'none'}
      />
      <Button mt='$5' onPress={() => signInWithEmail()} >Sign In</Button>
      <Button onPress={() => signUpWithEmail()} >Sign Up</Button>
    </Form>
  )
}