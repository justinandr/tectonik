import { X } from '@tamagui/lucide-icons';
import { useState, useEffect } from 'react'
import { CircleAlert } from '@tamagui/lucide-icons';
import { 
  Text,
  Button, 
  Card, 
  H2,
  H3, 
  Paragraph, 
  Theme, 
  XStack,
  XGroup, 
  YStack, 
  useTheme,
  ScrollView, 
  View} from 'tamagui'
import { supabase } from 'utils/supabase'
import { RefreshControl } from 'react-native';

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
  const [refreshing, setRefreshing] = useState(false)
  const [renderOpenTickets, setRenderOpenTickets] = useState(true)

  async function fetchTickets() {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select()

        setRefreshing(false)
        
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

  function handleClick() {
    setRenderOpenTickets(!renderOpenTickets)
  }

  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={fetchTickets} />
    }>
      <YStack f={1} ai={'stretch'} gap="$8" px="$3" pt="$6" bg="$background">
        <H2 ta={'left'}>Tickets</H2>
        <XGroup>
          <XGroup.Item>
            <Button 
              width="50%" 
              size="$2" 
              color={renderOpenTickets ? "green" : "red"}
              onPress={handleClick}
              disabled={renderOpenTickets}
              >
              Open
            </Button>
          </XGroup.Item>

          <XGroup.Item>
            <Button 
              width="50%" 
              size="$2" 
              color={renderOpenTickets ? "red" : "green"}
              onPress={handleClick}
              disabled={!renderOpenTickets}
              >
              Closed
            </Button>
          </XGroup.Item>
        </XGroup>
        <YStack gap="$2">
          {tickets.map(ticket => {
            if(ticket.status === 'open' && renderOpenTickets) {
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
            }
            else if(ticket.status === 'closed' && !renderOpenTickets) {
              return (
                <Card key={ticket.id} elevate bg='$accentBackground'>
                  <Card.Header>
                    <H3>
                      {ticket.location}
                    </H3>
                    <Paragraph>{ticket.description}</Paragraph>
                  </Card.Header>
                </Card>
              )
            }
          })}
        </YStack>
      </YStack>
    </ScrollView>
  )
}
