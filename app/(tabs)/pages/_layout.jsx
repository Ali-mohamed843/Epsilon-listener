import { Stack } from 'expo-router';
import { View } from 'react-native';
import BottomTabBar from '../../../components/BottomTabBar.jsx';

export default function PagesLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomTabBar />
    </View>
  );
}