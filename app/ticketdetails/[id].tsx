import { ScrollView, YStack, H2, H4, H5, Paragraph, Button, Image, YGroup } from 'tamagui'
import { Circle } from '@tamagui/lucide-icons'
import { useLocalSearchParams, router } from 'expo-router'
import { supabase } from 'utils/supabase'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'

type Ticket = {
  id: string;
  created_at: string;
  color_code: string;
  title: string;
  status: string;
  description: string;
  user_id: string;
  location_name: string;
  location_id: string;
  images: string[];
}

export default function TicketByID() {

  const { id } = useLocalSearchParams()
  const [ticket, setTicket] = useState<Ticket | null>()
  const [userName, setUserName] = useState<string>('')
  const [images, setImages] = useState<string[]>([])
  const [imageUris, setImageUris] = useState<string[]>([])

  useEffect(() => {
    async function fetchTicket() {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', id)
          
          if (error) {
            throw error
          }
          setTicket(data[0] as Ticket)
          setImages(data[0].images)
      }
      catch (error) {
        console.log('error', error)
      }
    }
    fetchTicket()
  }, [])

  useEffect(() => {
    async function fetchUserName() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('name')
          .eq('user_id', ticket?.user_id)
          
          if (error) {
            throw error
          }
          setUserName(data[0].name)
      }
      catch (error) {
        console.log('error', error)
      }
    }
    if (ticket) {
      fetchUserName()
    }
  }, [ticket])

  useEffect(() => {
    async function fetchImageUris() {
      try {
        const { data, error } = await supabase
          .storage
          .from('ticket-images')
          .createSignedUrls(images, 60)
          
          if (error) {
            throw error
          }
          setImageUris(data.map(image => image.signedUrl))
      }
      catch (error) {
        console.log('error', error)
      }
    }
    if (images.length > 0){
      fetchImageUris()
    }
  }, [images]) 

  async function closeTicket() {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'closed' })
        .eq('id', id)
        
        if (error) {
          throw error
        }
    }
    catch (error) {
      console.log('error', error)
    }
    router.replace('/(tabs)')
  }

  async function reopenTicket() {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'open' })
        .eq('id', id)
        
        if (error) {
          throw error
        }
    }
    catch (error) {
      console.log('error', error)
    }
    router.replace('/(tabs)')
  } 

  return (
    <ScrollView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <YStack flex={1} ai={'stretch'} gap="$2" px="$3" pt="$6" pb='$zIndex.4' bg="$background">
        {ticket ? (
          <>
            <H2>
              {ticket.location_name + ' - ' + ticket.title + ' '}

              {ticket.color_code === 'red' && ticket.status === 'open' ? 
                <Circle marginBottom='$1.5' alignSelf='flex-end' size={'$1'} color={'$red10'} />
              : null}
              {ticket.color_code === 'orange' && ticket.status === 'open' ? 
              <Circle marginBottom='$1.5' alignSelf='flex-end' size={'$1'} color={'$orange7'} /> 
              : null}
              {ticket.color_code === 'green' && ticket.status === 'open' ? 
              <Circle marginBottom='$1.5' alignSelf='flex-end' size={'$1'} color={'$green10'} /> 
              : null}
            </H2>
            <H4>Submitted by: {userName ? userName : ''}</H4>
            <H5>Status: {ticket.status}</H5>
            <H5>{ new Date(ticket.created_at).toLocaleString('en-us', {
                  weekday: 'long', 
                  month: 'long', 
                  year: 'numeric', 
                  day: 'numeric', 
                  hour: 'numeric', 
                  minute: 'numeric', 
                  hourCycle: 'h12'
                  })}
            </H5>
            <Paragraph fontWeight={'bold'}>Description:</Paragraph>
            <Paragraph>{ticket.description}</Paragraph>
          </>
        ) : <H4>Loading...</H4>}
        {imageUris ? 
          imageUris.map((image, index) => {
            return (
              <YGroup flex={1} ai={'center'} key={index}>
                <Image key={index} source={{ uri: image }} width={360} height={360} />
              </YGroup>
            )
          })
        : null}
        {ticket?.status === 'closed' ? 
          <Button onPress={reopenTicket}>Reopen Ticket</Button>
        : null}
        {ticket?.status === 'open' ? 
          <Button onPress={closeTicket}>Close Ticket</Button>
        : null}
        <Button>Create Report</Button>
      </YStack>
    </ScrollView>
  )
} 