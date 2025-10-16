import { registerWebModule, NativeModule } from 'expo';

import { ChaosNativeModuleEvents } from './ChaosNative.types';

class ChaosNativeModule extends NativeModule<ChaosNativeModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ChaosNativeModule, 'ChaosNativeModule');
