import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase'

export default function NewTicketScreen() {
  // State for form inputs
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [colorCode, setColorCode] = useState('');
  
  // State for snackbar (to show confirmation message)
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Function to handle form submission
  const handleSubmit = async () => {
    if (location && description && colorCode) {
      const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          created_at: new Date().toISOString(),
          location: location,
          description: description,
          colorCode: colorCode
        }
      ])

      if (error) {
        console.error('Error inserting ticket:', error);
        setSnackbarMessage('Error creating ticket');
      } else {
        console.log('Ticket created:', data);
        setSnackbarMessage('Ticket Created Successfully!');
        resetForm();
      }

      setSnackbarVisible(true); // Show success message
      resetForm();
    } else {
      console.log('Please fill all fields');
    }
  };

  // Function to reset form fields
  const resetForm = () => {
    setLocation('');
    setDescription('');
    setColorCode('');
  };

  return (
    <ScrollView style={styles.container} keyboardDismissMode='on-drag'> 
      <Text variant="titleLarge">Create New Ticket</Text>

      <TextInput
        label="Location"
        value={location}
        onChangeText={setLocation}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <TextInput
        label="Color Code"
        value={colorCode}
        onChangeText={setColorCode}
        mode="outlined"
        style={styles.input}
      />

      <Button mode="outlined" onPress={handleSubmit} style={styles.button}>
        Create Ticket
      </Button>

      <Snackbar
        style={styles.snackbar}
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Ticket Created Successfully!
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 100
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  snackbar: {
    
  }
});
