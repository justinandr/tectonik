import { useState } from 'react';
import { Button, Image, View } from 'tamagui';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from 'utils/supabase';

export default function TicketImagePicker() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
      exif: false,
      base64: true,
    });

    if (result.assets) {
        const { data, error } = await supabase.storage
            .from('ticket-images')
            .upload(`ticket-${Date.now()}.jpg`, decode(result.assets[0].base64 as string), { //This is a type error, I'll fix it later
                contentType: 'image/jpeg',
            });
        if (error) {
            console.error('Error uploading image:', error);
            return;
        }
        console.log('Image uploaded:', data);
        }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Button onPress={pickImage}>Select Image</Button>
      {image && <Image source={{ uri: image }}/>}
    </View>
  );
}