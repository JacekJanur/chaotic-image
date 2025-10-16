import { NativeModule, requireNativeModule } from 'expo';

import { ChaosNativeModuleEvents } from './ChaosNative.types';

declare class ChaosNativeModule extends NativeModule<ChaosNativeModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ChaosNativeModule>('ChaosNative');
