import { useEffect, useState } from 'react'
import { ChevronDown, Check, X } from '@tamagui/lucide-icons'
import { supabase } from 'utils/supabase'
import { Circle, Image as ImageIcon } from '@tamagui/lucide-icons'
import * as ImagePicker from 'expo-image-picker'
import { decode } from 'base64-arraybuffer'
import { useToastController } from '@tamagui/toast'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { 
  View,
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
  Button,
  Image,
  XGroup
} from 'tamagui'

type Location = {
  id: string;
  address: string;
  name: string;
}

type SelectedImage = {
  base64: string;
  uri: string;
  fileName: string;
}

export default function NewTicket() {

  const [locations, setLocations] = useState<Location[]>([])
  const [locationIds, setLocationIds] = useState<string[]>([])
  const [images, setImages] = useState<SelectedImage[]>([])
  const [selectedLocationName, setSelectedLocationName] = useState('')
  const [colorCode, setColorCode] = useState('green')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [formStatus, setFormStatus] = useState<'off' | 'submitting' | 'submitted'>('off')
  const colorOptions = ['green', 'orange', 'red']
  const toast = useToastController()

  useEffect(() => {
    const fetchUserLocations = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        console.error('User is not authenticated')
        return
      }

      const { data: locations, error } = await supabase
        .from('users-locations')
        .select('location_id')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching locations:', error)
        return
      }

      setLocationIds(locations.map(location => location.location_id))
    }

    fetchUserLocations()
  }, [])

  useEffect(() => {
    const fetchLocations = async () => {
      const { data: locations, error } = await supabase
        .from('locations')
        .select('*')
        .in('id', locationIds)

      if (error) {
        console.error('Error fetching locations:', error)
        return
      }

      setLocations(locations)
    }

    fetchLocations()
  }, [locationIds])

  async function submitForm() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.error('User is not authenticated')
      return
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert([{ 
        color_code: colorCode, 
        title: title, 
        description: description,
        user_id: user.id,
        location_name: locations.find(location => location.name === selectedLocationName)?.name,
        location_id: locations.find(location => location.name === selectedLocationName)?.id,
        images: images.map(image => image.fileName as string)
      }])

      if (error) {
        console.error('Error inserting ticket:', error)
        return
      } else {
        console.log('Ticket inserted:', data)
      }

      if(images) {
        images.map(async image => {
          const { data, error } = await supabase.storage
            .from('ticket-images')
            .upload(image.fileName, decode(image.base64), {
              contentType: 'image/jpeg',
            })
  
            if (error) {
              console.error('Error uploading image:', error)
              return
            }
            if (data) {
              toast.show('Images Uploaded!', {
                type: 'success',
                message: 'Viewable in ticket details',
                duration: 5000,
              })
            }
        })
      }

      setFormStatus('submitted')

  }

  function clearImages() {
    setImages([])
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
      exif: false,
      base64: true,
    })

    if (!result.canceled) {
      const selectedImages = result.assets.map((image: any) => {
        return {
          base64: image.base64,
          uri: image.uri,
          fileName: image.uri.split('/').pop()
        }
      })

      setImages([...images, ...selectedImages])
    }
  }

  useEffect(() => {
    if (formStatus === 'submitting') {
      const timer = setTimeout(() => setFormStatus('off'), 2000)

      return () => {
        clearTimeout(timer)
        setColorCode('green')
        setTitle('')
        setDescription('')
        setSelectedLocationName('')
        setImages([])
        toast.show('Ticket Subitted', { 
          type: 'success',
          message: 'Images are being uploaded...',
          duration: 5000,
          bg: '$background',
        })
      }
    }
  }, [formStatus]) 

  return (
    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} style={{ flex: 1 }}>
    <View height={'100%'} bg="$background">
    <ScrollView keyboardDismissMode='on-drag'>
      <Form 
        f={1} 
        ai={'stretch'} 
        gap="$2" 
        px="$4" 
        pt="$6" 
        bg="$background"
        onSubmit= {() => {
          setFormStatus('submitting')
          submitForm()
        }}
      >
        <H2>New Ticket</H2>
        {locations.length > 1 ?
          <>
            <Label htmlFor='location'>Location:</Label>
            <Select value={selectedLocationName} onValueChange={setSelectedLocationName} native >
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
                    {locations.map((location, i) => (
                      <Select.Item index={i} key={location.name} value={location.name}>
                        <Select.ItemText>{location.name}</Select.ItemText>
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
          </>
        : null}
        <Label htmlFor='color_code'>Priority Level:</Label>
        <Select value={colorCode} onValueChange={setColorCode} native defaultValue={colorCode}>
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
                    <Select.ItemText>
                      {option.charAt(0).toUpperCase() + option.slice(1) + ' '}
                      {option === 'green' ? <Circle size={16} color='green' /> : null}
                      {option === 'orange' ? <Circle size={16} color='orange' /> : null}
                      {option === 'red' ? <Circle size={16} color='red' /> : null}
                    </Select.ItemText>
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
        <Input value={title} onChangeText={text => setTitle(text)} placeholder='Enter title' inputMode='text' />
        <Label htmlFor='description'>Description:</Label>
        <TextArea value={description} onChangeText={setDescription} height='$10' placeholder='Enter description'/>
        <Button icon={ImageIcon} onPress={pickImage}>Select Images</Button>
        <XGroup f={1} justifyContent='center' gap="$1">
        {images ? images.map((image, i) => {
          return (
            <XGroup.Item key={i}>
              <Image source={{ uri: image.uri }} width='$8' height='$8' />
            </XGroup.Item>
          )
        }) : null}
        </XGroup>
        {images.length > 0 ? <Button icon={X} onPress={clearImages} >Clear Images</Button> : null}
        <Form.Trigger asChild disabled={formStatus === 'submitting'}>
          <Button icon={formStatus === 'submitting' ? () => <Spinner /> : undefined}>Submit</Button>
        </Form.Trigger>
      </Form>
    </ScrollView> 
    </View> 
    </KeyboardAvoidingView>
  )
}