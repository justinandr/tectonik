import { View, Text, ScrollView, YStack, H2, H4, H5, Paragraph, Button } from 'tamagui'
import { Circle } from '@tamagui/lucide-icons'
import { useLocalSearchParams } from 'expo-router'
import { supabase } from 'utils/supabase'
import { useEffect, useState } from 'react'

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
    }
    catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    fetchTicket()
  }, [])

  return (
    <ScrollView>
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
            <H4>Submitted by: {ticket.user_id}</H4>
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
        <Button>Close Ticket</Button>
        <Button>Create Report</Button>
      </YStack>
    </ScrollView>
  )
} 