import { X } from '@tamagui/lucide-icons';
import { useState, useEffect } from 'react'
import { CircleAlert } from '@tamagui/lucide-icons';
import { 
  Button, 
  Card, 
  H2,
  H3, 
  Paragraph, 
  Theme, 
  XStack, 
  YStack, 
  useTheme,
  ScrollView } from 'tamagui'
import { supabase } from 'utils/supabase'

type Ticket = {
  id: number;
  created_at: string;
  color_code: string;
  status: string;
  location: string;
  description: string;
}

export default function TabOneScreen() {

  const theme = useTheme()
  const [tickets, setTickets] = useState<Ticket[]>([])

  async function fetchTickets() {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')

        if (error) {
          throw error
        }
        setTickets(data as Ticket[])
    }
    catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  return (
    <ScrollView>
      <YStack f={1} ai={'stretch'} gap="$8" px="$3" pt="$6" bg="$background">
        <H2 ta={'left'}>Tickets</H2>
        <YStack gap="$2">
          {tickets.map(ticket => {
            return (
              <Card key={ticket.id} elevate bg='$accentBackground'>
                <Card.Header>
                  <H3>
                    {ticket.location}
                    {ticket.color_code === 'red' && ticket.status === 'open' ? 
                    <CircleAlert px='$6' size={20} color='$red10' /> 
                    : null}
                  </H3>
                  <Paragraph>{ticket.description}</Paragraph>
                </Card.Header>
              </Card>
            )
          })}
        </YStack>
      </YStack>
    </ScrollView>
  )
}
