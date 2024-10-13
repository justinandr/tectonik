import { useState } from 'react'
import { ChevronDown, Check } from '@tamagui/lucide-icons'
import { 
  ScrollView,
  YStack, 
  Text, 
  View, 
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

  const formData = useState({
    color_code: '',
    status: 'open',
    location: '',
    description: ''
  })

  const [colorCode, setColorCode] = useState('green')
  const colorOptions = ['green', 'orange', 'red']

  return (
    <ScrollView>
      <YStack f={1} ai={'stretch'} gap="$8" px="$3" pt="$6" bg="$background">
        <H2>New Ticket</H2>
        <YStack>
          <Label px='$1' htmlFor='color_code'>Color Code:</Label>
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
          <Label px='$1' htmlFor='description'>Description:</Label>
          <TextArea id='description' height={'6'} placeholder='Enter description'/>
          <Button>Submit</Button>
        </YStack>
      </YStack>
    </ScrollView>  
  )
}
