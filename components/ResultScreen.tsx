import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type ResultScreenProps = {
  visible: boolean;
  processing: boolean;
  resultBase64: string | null;
  action: 'scramble' | 'unscramble' | null;
  onClose: () => void;
};

const ResultScreen: React.FC<ResultScreenProps> = ({
  visible,
  processing,
  resultBase64,
  action,
  onClose,
}) => {
  const handleSave = async () => {
    if (!resultBase64) return;
    // TODO: Implement save functionality
    console.log('Save to gallery - to be implemented');
  };

const handleShare = async () => {
  if (!resultBase64) return;

  try {
    const file = new File(Paths.cache, `chaos_${Date.now()}.png`);

    await file.create();
    await file.write(resultBase64, { encoding: 'base64' }); 

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return;
    }

    await Sharing.shareAsync(file.uri, {
      mimeType: 'image/png',
      dialogTitle: action === 'scramble' ? 'Share Scrambled Image' : 'Share Unscrambled Image',
      UTI: 'public.png', // dla iOS
    });

  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Error', 'Failed to share image');
  }
};


  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {processing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#355a7a" />
            <Text style={styles.loadingText}>
              {action === 'scramble' ? 'Applying chaos...' : 'Restoring order...'}
            </Text>
            <Text style={styles.subText}>
              {action === 'scramble'
                ? 'Permuting pixels and applying substitution'
                : 'Reversing substitution and unpermuting'}
            </Text>
          </View>
        ) : resultBase64 ? (
          <View style={styles.resultContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {action === 'scramble' ? 'Image Scrambled' : 'Image Unscrambled'}
              </Text>
              <Text style={styles.subtitle}>
                {action === 'scramble'
                  ? 'Your image is now protected with chaotic encryption'
                  : 'Your image has been successfully restored'}
              </Text>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `data:image/png;base64,${resultBase64}` }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.buttonText}>Save to Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={handleShare}>
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#355a7a',
    textAlign: 'center',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  resultContainer: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#355a7a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#355a7a',
  },
  shareButton: {
    backgroundColor: '#4a7a9e',
  },
  closeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#355a7a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButtonText: {
    color: '#355a7a',
    fontSize: 16,
    fontWeight: '600',
  },
});