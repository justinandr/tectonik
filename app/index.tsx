import { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { supabase } from 'utils/supabase'
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        router.replace("/(tabs)")
      } else router.replace("/(tabs)")
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        router.replace("/(tabs)")
      } else router.replace("/(tabs)")
    })
  }, [])
}