import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MainHeaderProps {
  title?: string;
  onSettingsPress?: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ title = 'Chaotic Image', onSettingsPress }) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <SafeAreaView>
      <View style={[styles.headerContainer, { borderBottomColor: colorScheme === 'dark' ? '#555' : '#ccc' }]}>
          <Text style={[styles.title, { color: textColor }]}></Text>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <TouchableOpacity onPress={onSettingsPress}>
        <Ionicons name="settings-outline" size={24} color={textColor} />
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
