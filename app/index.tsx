import MainActions from '@/components/MainActions';
import MainHeader from '@/components/MainHeader';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <MainHeader />
      <MainActions />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
