import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ActionType = 'scramble' | 'unscramble';

interface ImagePreviewModalProps {
  visible: boolean;
  imageUri: string | null;
  action: ActionType | null;
  onClose: () => void;
  onContinue: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  imageUri,
  action,
  onClose,
  onContinue,
}) => {
  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <Ionicons name="close" size={28} color="#355a7a" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {action === 'scramble' ? 'Scramble' : 'Unscramble'}
          </Text>

          <TouchableOpacity onPress={onContinue} style={styles.iconButton}>
            <Ionicons name="checkmark" size={28} color="#355a7a" />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageWrapper}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ImagePreviewModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#355a7a',
  },
  iconButton: {
    padding: 8,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },
});
