import * as ImagePicker from 'expo-image-picker'
import { Alert, type AlertButton } from 'react-native'

export type PickOption = 'camera' | 'gallery'

interface PickImageOptions {
  title?: string
  message?: string
  options?: PickOption[] // defaults to both camera & gallery
}

/**
 * Opens a native alert letting the user choose image source
 * and returns the selected image URI or null if cancelled.
 * If only one option is provided, opens it directly without dialog.
 */
export async function pickImageDialog({
  title = 'Select Image',
  message = 'Choose image source',
  options = ['camera', 'gallery'],
}: PickImageOptions = {}): Promise<string | null> {
  try {
    let choice: PickOption | null = null

    // If only one option, use it directly without showing dialog
    if (options.length === 1) {
      choice = options[0]
    } else {
      // Show dialog for multiple options
      choice = await new Promise<PickOption | null>((resolve) => {
        const buttons: AlertButton[] = []
        
        if (options.includes('camera')) {
          buttons.push({ text: 'Camera', onPress: () => resolve('camera') })
        }
        if (options.includes('gallery')) {
          buttons.push({ text: 'Gallery', onPress: () => resolve('gallery') })
        }
        
        Alert.alert(title, message, buttons, { cancelable: true })
      })
    }

    if (!choice) return null

    if (choice === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') return null
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
        base64: true,
      })
      return result.canceled || result.assets[0].base64 == null ? null : result.assets[0].base64
    }

    if (choice === 'gallery') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') return null
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        base64: true,
      })
      return result.canceled || result.assets[0].base64 == null  ? null : result.assets[0].base64
    }

    return null
  } catch (err) {
    console.error('Error picking image:', err)
    return null
  }
}