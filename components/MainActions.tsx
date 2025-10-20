import { scrambleImageBase64, unscrambleImageBase64 } from '@/utils/chaoticImage';
import { pickImageDialog } from '@/utils/pickImage';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePreviewModal from './ImagePreviewModal';
import PasswordDialog from './PasswordDialog';
import ResultScreen from './ResultScreen';

type ActionType = 'scramble' | 'unscramble';

const MainActions = () => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isPasswordDialogVisible, setIsPasswordDialogVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);

  const [isResultVisible, setIsResultVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBase64, setResultBase64] = useState<string | null>(null);

  const handleScramble = async () => {
    const base64 = await pickImageDialog({
      title: 'Scramble Image',
      message: 'Pick an image to apply chaos',
    });

    if (base64) {
      setSelectedImageBase64(base64);
      setCurrentAction('scramble');
      setIsPreviewVisible(true);
    }
  };

  const handleUnscramble = async () => {
    const base64 = await pickImageDialog({
      title: 'Unscramble Image',
      message: 'Select image to restore order',
      options: ['gallery'],
    });

    if (base64) {
      setSelectedImageBase64(base64);
      setCurrentAction('unscramble');
      setIsPreviewVisible(true);
    }
  };

  const handleClose = () => {
    setIsPreviewVisible(false);
    setSelectedImageBase64(null);
    setCurrentAction(null);
  };

  const handleContinue = () => {
    setIsPasswordDialogVisible(true);
  };

  const handlePasswordSubmit = async (submittedPassword: string) => {
    if (!selectedImageBase64 || !currentAction) return;

    setIsPasswordDialogVisible(false);
    setIsPreviewVisible(false);
    setIsProcessing(true);
    setIsResultVisible(true);

    try {
      let result: string;

      if (currentAction === 'scramble') {
        result = await scrambleImageBase64(selectedImageBase64, submittedPassword);
      } else {
        result = await unscrambleImageBase64(selectedImageBase64, submittedPassword);
      }

      setResultBase64(result);
      setIsProcessing(false);
    } catch (err) {
      console.error('Processing failed:', err);
      setIsProcessing(false);
      setIsResultVisible(false);

      Alert.alert(
        'Processing Failed',
        err instanceof Error ? err.message : 'An unknown error occurred',
        [{ text: 'OK' }],
      );
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordDialogVisible(false);
  };

  const handleResultClose = () => {
    setIsResultVisible(false);
    setResultBase64(null);
    setSelectedImageBase64(null);
    setCurrentAction(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Chaotic Image Encryptor</Text>
          <Text style={styles.description}>
            Secure your images with chaos theory-based encryption
          </Text>
        </View>

           <TouchableOpacity style={[styles.button, styles.primary]} onPress={handleScramble}>
        <Text style={styles.primaryText}>Scramble Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={handleUnscramble}>
        <Text style={styles.secondaryText}>Unscramble Image</Text>
      </TouchableOpacity>
      </View>

      <ImagePreviewModal
        visible={isPreviewVisible}
        imageUri={`data:image/png;base64,${selectedImageBase64}`}
        action={currentAction}
        onClose={handleClose}
        onContinue={handleContinue}
      />

      <PasswordDialog
        visible={isPasswordDialogVisible}
        action={currentAction}
        onSubmit={handlePasswordSubmit}
        onCancel={handlePasswordCancel}
      />

      <ResultScreen
        visible={isResultVisible}
        processing={isProcessing}
        resultBase64={resultBase64}
        action={currentAction}
        onClose={handleResultClose}
      />
    </View>
  );
};

export default MainActions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#355a7a',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  primary: {
    backgroundColor: '#355a7a',
    shadowColor: '#355a7a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#355a7a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryText: {
    color: '#355a7a',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  buttonDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
