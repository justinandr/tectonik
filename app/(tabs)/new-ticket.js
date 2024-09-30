import React, { useState } from 'react';
import { View, TextInput, Button, Text, Image, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames

const TicketSchema = Yup.object().shape({
  color_code: Yup.string().required('Color-code is required'),
  location: Yup.string().required('Location is required'),
  description: Yup.string().required('Description is required'),
});

export default function TicketSubmissionScreen({ navigation }) {
  const [image, setImage] = useState(null);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `${uuidv4()}.jpg`;

      const { data, error } = await supabase.storage
        .from('ticket-images') // Your storage bucket name
        .upload(filename, blob);

      if (error) {
        throw error;
      }

      const { publicUrl } = supabase.storage
        .from('ticket-images')
        .getPublicUrl(filename);

      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  return (
    <Formik
      initialValues={{ location: '', description: '' }}
      validationSchema={TicketSchema}
      onSubmit={async (values) => {
        try {
          const imageUrl = image ? await uploadImage(image) : null;

          // Insert ticket data into Supabase
          const { data, error } = await supabase
            .from('tickets')
            .insert([{ created_at: new Date().toISOString(), location: values.location, description: values.description, image_url: imageUrl }]);

          if (error) {
            throw error;
          }

          alert('Ticket Submitted!');
          navigation.goBack(); // Go back after submission
        } catch (error) {
          console.error('Ticket submission error:', error);
          alert('Error submitting ticket');
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Location"
            onChangeText={handleChange('location')}
            onBlur={handleBlur('location')}
            value={values.location}
          />
          {touched.location && errors.location && (
            <Text style={styles.error}>{errors.location}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            multiline
          />
          {touched.description && errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}

          <Button title="Upload Image" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}

          <Button title="Submit Ticket" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  error: {
    color: 'red',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});
