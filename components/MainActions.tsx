import { scrambleImageBase64, unscrambleImageBase64 } from '@/utils/chaoticImage';
import { pickImageDialog } from '@/utils/pickImage';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePreviewModal from './ImagePreviewModal';
import PasswordDialog from './PasswordDialog';

type ActionType = 'scramble' | 'unscramble';

const MainActions = () => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isPasswordDialogVisible, setIsPasswordDialogVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
  const [loading, setLoading] = useState(false);

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
    setPassword('');
    setLoading(false);
  };

  const handleContinue = () => {
    setIsPasswordDialogVisible(true);
  };

  const handlePasswordSubmit = async (submittedPassword: string) => {
    if (!selectedImageBase64 || !currentAction) return;
    setIsPasswordDialogVisible(false);
    setLoading(true);

    try {
      let resultBase64: string;
      if (currentAction === 'scramble') {
        resultBase64 = await scrambleImageBase64(selectedImageBase64, submittedPassword);
      } else {
        resultBase64 = await unscrambleImageBase64(selectedImageBase64, submittedPassword);
      }
    } catch (err) {
      console.error('Processing failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordDialogVisible(false);
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.primary]} onPress={handleScramble}>
        <Text style={styles.primaryText}>Scramble Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={handleUnscramble}>
        <Text style={styles.secondaryText}>Unscramble Image</Text>
      </TouchableOpacity>

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

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#355a7a" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}
    </View>
  );
};

export default MainActions;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  button: { width: '100%', paddingVertical: 14, borderRadius: 10, marginVertical: 8, alignItems: 'center' },
  primary: { backgroundColor: '#355a7a' },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondary: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#355a7a' },
  secondaryText: { color: '#355a7a', fontSize: 16, fontWeight: '600' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#355a7a' },
});
