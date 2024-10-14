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

export default function TabTwoScreen() {

  const [colorCode, setColorCode] = useState('green')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [formStatus, setFormStatus] = useState<'off' | 'submitting' | 'submitted'>('off')
  const colorOptions = ['green', 'orange', 'red']

  async function submitForm() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User is not authenticated')
      return
    }

    const { error } = await supabase
      .from('tickets')
      .insert([{ color_code: colorCode, 
        title: title, 
        description: description,
        user_id: user.id
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

  return (
    <ScrollView>
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
        <Input id='title' value={title} onChangeText={setTitle} placeholder='Enter title'/>
        <Label htmlFor='description'>Description:</Label>
        <TextArea id='description' value={description} onChangeText={setDescription} height='$10' placeholder='Enter description'/>
        <Form.Trigger asChild disabled={formStatus !== 'off'}>
          <Button icon={formStatus === 'submitting' ? () => <Spinner /> : undefined}>Submit</Button>
        </Form.Trigger>
      </Form>
    </ScrollView>  
  )
}
