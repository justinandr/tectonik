import { useState, useEffect } from 'react'
import { Link } from 'expo-router';
import { Circle } from '@tamagui/lucide-icons';
import { 
  Button, 
  Card, 
  H2,
  H3, 
  Paragraph,
  XGroup, 
  YStack,
  ScrollView,
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

export default function Home() {

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [renderOpenTickets, setRenderOpenTickets] = useState(true)

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
      <YStack f={1} ai={'stretch'} gap="$3" px="$4" pt="$6" paddingBottom='$zIndex.1' bg="$background">
        <H2>Tickets</H2>
        <XGroup pb='$2'>
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
        <YStack ai={'center'} gap="$2">
          {tickets.map(ticket => {
            if(ticket.status === 'open' && renderOpenTickets) {
              return (
                <Link href={`/ticketdetails/${ticket.id}`} key={ticket.id}>
                  <Card key={ticket.id} minWidth={'100%'} elevate bg='$accentBackground'>
                    <Card.Header>
                      <H3>
                      {ticket.location_name + ' - ' + ticket.title + ' '}
                      {ticket.color_code === 'red' && ticket.status === 'open' ? 
                      <Circle marginBottom='$1' alignSelf='flex-end' size={'$1'} color={'$red10'} /> 
                      : null}
                      {ticket.color_code === 'orange' && ticket.status === 'open' ? 
                      <Circle marginBottom='$1' alignSelf='flex-end' size={'$1'} color={'$orange7'} /> 
                      : null}
                      {ticket.color_code === 'green' && ticket.status === 'open' ? 
                      <Circle marginBottom='$1' alignSelf='flex-end' size={'$1'} color={'$green10'} /> 
                      : null}
                      </H3>
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
                      <Paragraph>{ticket.description.length > 100 ? ticket.description.slice(0, 100) + '...' : ticket.description}</Paragraph>
                    </Card.Header>
                  </Card>
                </Link>
              )
            }
            else if(ticket.status === 'closed' && !renderOpenTickets) {
              return (
                <Link href={`/ticketdetails/${ticket.id}`} key={ticket.id}>
                  <Card key={ticket.id} minWidth={'100%'} elevate bg='$accentBackground'>
                    <Card.Header>
                      <H3>{ticket.location_name + ' - ' + ticket.title}</H3>
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
                      <Paragraph>{ticket.description.length > 100 ? 
                        ticket.description.slice(0, 100) + '...' 
                        : ticket.description}
                      </Paragraph>
                    </Card.Header>
                  </Card>
                </Link>
              )
            }
          })}
        </YStack>
      </YStack>
    </ScrollView>
  )
}
