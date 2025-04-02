/**
 * Sample React Native App with @react-native-documents/picker
 */

import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
  Alert,
} from 'react-native';
import { pick, types } from '@react-native-documents/picker'; // Updated import
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface FileObject {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const [newFileName, setNewFileName] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const safePadding = '5%';

  const pickFile = async () => {
    try {
      // Use pick() method with allowMultiSelection: false for single file
      const [result] = await pick({
        type: [types.allFiles], // Use types from the library
        allowMultiSelection: false, // Ensures single file selection
      });

      console.log('Picker result:', result); // Log to verify structure

      const fileName = result.name ?? '';
      const fileType = result.type ?? 'unknown';
      const fileSize = result.size ?? undefined;

      setSelectedFile({
        uri: result.uri,
        name: fileName,
        type: fileType,
        size: fileSize,
      });
      setNewFileName(fileName);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', 'Failed to pick file: ' + errorMessage);
      console.log('Full error:', error);
    }
  };

  const renameFile = async () => {
    if (!selectedFile || !newFileName) {
      Alert.alert('Error', 'Please select a file and enter a new name');
      return;
    }

    try {
      const fileExtension = selectedFile.name.split('.').pop();
      const newFileNameWithExt = newFileName.includes('.')
        ? newFileName
        : `${newFileName}.${fileExtension}`;

      const updatedFile = {
        ...selectedFile,
        name: newFileNameWithExt,
      };

      setSelectedFile(updatedFile);
      Alert.alert('Success', `File name updated to ${newFileNameWithExt} (Note: Demo only)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', 'Failed to rename file: ' + errorMessage);
    }
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View style={{ padding: safePadding }}>
          <Button title="Pick a File" onPress={pickFile} />

          {selectedFile && (
            <View style={styles.fileInfo}>
              <Text style={styles.sectionTitle}>
                Selected File: {selectedFile.name}
              </Text>
              <Text>Type: {selectedFile.type}</Text>
              <Text>Size: {selectedFile.size ? `${selectedFile.size} bytes` : 'Unknown'}</Text>

              <TextInput
                style={styles.input}
                value={newFileName}
                onChangeText={setNewFileName}
                placeholder="Enter new file name"
              />

              <Button title="Rename File" onPress={renameFile} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  fileInfo: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default App;