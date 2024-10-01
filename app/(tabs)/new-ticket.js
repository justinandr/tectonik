import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { ScrollView } from 'react-native';

export default function NewTicketScreen() {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  
  // State for snackbar (to show confirmation message)
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Function to handle form submission
  const handleSubmit = () => {
    if (title && description && client) {
      console.log({
        title,
        description,
        client,
      });
      setSnackbarVisible(true); // Show success message
      resetForm();
    } else {
      console.log('Please fill all fields');
    }
  };

  // Function to reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setClient('');
  };

  return (
    <ScrollView style={styles.container} keyboardDismissMode='on-drag'> 
      <Text variant="titleLarge">Create New Ticket</Text>

      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
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
        label="Client"
        value={client}
        onChangeText={setClient}
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
