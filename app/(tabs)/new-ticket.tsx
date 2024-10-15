import { useEffect, useState } from 'react'
import { ChevronDown, Check } from '@tamagui/lucide-icons'
import { supabase } from 'utils/supabase'
import { 
  ScrollView,
  Form, 
  Spinner,
  H2,
  Input,
  TextArea,
  Select,
  Label,
  Sheet,
  Adapt,
  Button
} from 'tamagui'

type Location = {
  user_id: string;
  location_id: string;
}

export default function TabTwoScreen() {

  const [locations, setLocations] = useState<Location[]>([])
  const [locationNames, setLocationNames] = useState<string[]>([])
  const [userId, setUserId] = useState('')
  const [colorCode, setColorCode] = useState('green')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [formStatus, setFormStatus] = useState<'off' | 'submitting' | 'submitted'>('off')
  const colorOptions = ['green', 'orange', 'red']

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        console.error('User is not authenticated')
        return
      }

      setUserId(user.id)
      fetchUserLocations(user.id)
      fetchLocationNames()
    })
  }, [])

  async function fetchUserLocations(id: string) {
    const { data, error } = await supabase
      .from('users-locations')
      .select('*')
      .eq('user_id', id)

      if (error) {
        console.error('Error fetching locations:', error)
        return
      }

      setLocations(data)
  }

  async function fetchLocationNames() {
    const { data, error } = await supabase
      .from('locations')
      .select('name')
      .eq('id', locations.map(location => location.location_id))

      if (error) {
        console.error('Error fetching location names:', error)
        return
      }

      setLocationNames(data.map((location: { name: string }) => location.name))
  }  

  async function submitForm() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User is not authenticated')
      return
    }

    const { error } = await supabase
      .from('tickets')
      .insert([{ 
        color_code: colorCode, 
        title: title, 
        description: description,
        user_id: user.id,
        location_name: locationNames[0],
        location_id: locations[0].location_id,
      }])

      if (error) {
        console.error('Error inserting ticket:', error)
        return
      }

      setFormStatus('submitted')

  }

  useEffect(() => {
    if (formStatus === 'submitting') {
      const timer = setTimeout(() => setFormStatus('off'), 2000)

      return () => {
        clearTimeout(timer)
        setColorCode('green')
        setTitle('')
        setDescription('')
      }
    }
  }, [formStatus])

  console.log(userId, locations, locationNames)

  return (
    <ScrollView keyboardDismissMode='on-drag'>
      <Form 
        f={1} 
        ai={'stretch'} 
        gap="$2" 
        px="$6" 
        pt="$6" 
        bg="$background"
        onSubmit= {() => {
          setFormStatus('submitting')
          submitForm()
        }}
        pb="$20"
      >
        <H2>New Ticket</H2>
        <Label htmlFor='color_code'>Priority Level:</Label>
        <Select value={colorCode} onValueChange={setColorCode} native id='color_code' defaultValue={colorCode}>
          <Select.Trigger iconAfter={ChevronDown}>
            <Select.Value placeholder='Select One' />
          </Select.Trigger>
          <Adapt when="sm" platform="touch">
            <Sheet>
              <Sheet.Frame>
                <Adapt.Contents />
              </Sheet.Frame>
              <Sheet.Overlay />
            </Sheet>
          </Adapt>

          <Select.Content>
            <Select.ScrollUpButton />
            <Select.Viewport>
              <Select.Group>
                {colorOptions.map((option, i) => (
                  <Select.Item index={i} key={option} value={option}>
                    <Select.ItemText>{option}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select>
        <Label htmlFor='title'>Title</Label>
        <Input id='title' value={title} onChangeText={text => setTitle(text)} placeholder='Enter title'/>
        <Label htmlFor='description'>Description:</Label>
        <TextArea id='description' value={description} onChangeText={setDescription} height='$10' placeholder='Enter description'/>
        <Form.Trigger asChild disabled={formStatus !== 'off'}>
          <Button icon={formStatus === 'submitting' ? () => <Spinner /> : undefined}>Submit</Button>
        </Form.Trigger>
      </Form>
    </ScrollView>  
  )
}
