import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://npobhixhpkknyiongejd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wb2JoaXhocGtrbnlpb25nZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM4MzYxNDAsImV4cCI6MjAzOTQxMjE0MH0.hbN1xI8UaUieFJ9rKZaP5XiKra0JIx1ED_9aWw3yt-I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})