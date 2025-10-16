import { requireNativeView } from 'expo';
import * as React from 'react';

import { ChaosNativeViewProps } from './ChaosNative.types';

const NativeView: React.ComponentType<ChaosNativeViewProps> =
  requireNativeView('ChaosNative');

export default function ChaosNativeView(props: ChaosNativeViewProps) {
  return <NativeView {...props} />;
}
