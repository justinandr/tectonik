import { useState, useEffect } from 'react'
import { Circle } from '@tamagui/lucide-icons';
import { 
  Button, 
  Card, 
  H2,
  H3, 
  Paragraph,
  XGroup, 
  YStack, 
  useTheme,
  ScrollView,
  XStack,
  H5, 
} from 'tamagui'
import { supabase } from 'utils/supabase'
import { RefreshControl } from 'react-native';

type Ticket = {
  id: string;
  user_id: string;
  created_at: string;
  color_code: string;
  status: string;
  title: string;
  location_name: string;
  location_id: string;
  description: string;
}

export default function TabOneScreen() {

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [renderOpenTickets, setRenderOpenTickets] = useState(true)

  console.log(tickets[0])

  async function fetchTickets() {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select()
        
        if (error) {
          throw error
        }
        setRefreshing(false)
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
      <YStack f={1} ai={'stretch'} gap="$8" px="$3" pt="$6" pb='$zIndex.4' bg="$background">
        <H2 ta={'left'}>Tickets</H2>
        <XGroup>
          <XGroup.Item>
            <Button 
              width="50%" 
              size="$3" 
              bg={renderOpenTickets ? '$accentBackground' : "$background"}
              onPress={handleClick}
              disabled={renderOpenTickets}
              >
              Open
            </Button>
          </XGroup.Item>

          <XGroup.Item>
            <Button 
              width="50%" 
              size="$3" 
              bg={renderOpenTickets ? "$background" : "$accentBackground"}
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
                    <H3>{ticket.location_name + ' - ' + ticket.title}</H3>
                    <H5>{ticket.created_at}</H5>
                    <Paragraph>{ticket.description}</Paragraph>
                    {ticket.color_code === 'red' && ticket.status === 'open' ? <Circle alignSelf='flex-end' size={'$2'} color={'$red10'} /> : null}
                    {ticket.color_code === 'orange' && ticket.status === 'open' ? <Circle alignSelf='flex-end' size={'$2'} color={'$orange7'} /> : null}
                    {ticket.color_code === 'green' && ticket.status === 'open' ? <Circle alignSelf='flex-end' size={'$2'} color={'$green10'} /> : null}
                  </Card.Header>
                </Card>
              )
            }
            else if(ticket.status === 'closed' && !renderOpenTickets) {
              return (
                <Card key={ticket.id} elevate bg='$accentBackground'>
                  <Card.Header>
                    <H3>
                      {ticket.location_name}
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
