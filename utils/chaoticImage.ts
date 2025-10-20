import { requireNativeModule } from 'expo';

const ChaosNative = requireNativeModule('ChaosNative');

export async function scrambleImageBase64(base64: string, password: string): Promise<string> {
  try {
    const result = await ChaosNative.scrambleImage(base64, password);
    return result;
  } catch (error) {
    console.error('Scramble error:', error);
    throw new Error(`Failed to scramble image: ${error}`);
  }
}

export async function unscrambleImageBase64(base64: string, password: string): Promise<string> {
  try {
    const result = await ChaosNative.unscrambleImage(base64, password);
    return result;
  } catch (error) {
    console.error('Unscramble error:', error);
    throw new Error(`Failed to unscramble image: ${error}`);
  }
}
