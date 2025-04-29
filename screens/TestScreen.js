import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function TestScreen() {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type something..."
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity style={styles.button} onPress={() => alert('Button pressed!')}>
        <Text style={styles.buttonText}>Press Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { width: '80%', borderColor: '#000', borderWidth: 1, padding: 10, marginBottom: 20 },
  button: { backgroundColor: 'blue', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
