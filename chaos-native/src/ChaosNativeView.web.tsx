import * as React from 'react';

import { ChaosNativeViewProps } from './ChaosNative.types';

export default function ChaosNativeView(props: ChaosNativeViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
