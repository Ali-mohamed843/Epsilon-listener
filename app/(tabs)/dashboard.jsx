import React from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const LogoIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  </Svg>
);

const DashboardLargeIcon = ({ size = 48, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={3} width={7} height={7} />
    <Rect x={14} y={3} width={7} height={7} />
    <Rect x={14} y={14} width={7} height={7} />
    <Rect x={3} y={14} width={7} height={7} />
  </Svg>
);

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const isSmallDevice = height < 700;
  const logoIconSize = isSmallDevice ? 32 : 36;
  const headerTitleSize = isSmallDevice ? 20 : 22;

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View
        className="bg-primary overflow-hidden"
        style={{
          paddingTop: insets.top || StatusBar.currentHeight || 0,
          paddingBottom: isSmallDevice ? 20 : 24,
          paddingHorizontal: width * 0.06,
        }}
      >
        <View className="absolute rounded-full" style={{ top: -50, right: -50, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.06)' }} />

        <View className="flex-row items-center" style={{ marginTop: 8, gap: 12 }}>
          <View className="items-center justify-center rounded-xl" style={{ width: logoIconSize, height: logoIconSize, backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <LogoIcon size={logoIconSize * 0.55} />
          </View>
          <View className="flex-1">
            <Text className="uppercase" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 2 }}>Analytics</Text>
            <Text className="text-white font-extrabold" style={{ fontSize: headerTitleSize, letterSpacing: -0.4 }}>External Dashboard</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: width * 0.1, paddingBottom: 60 }}>
        <View
          className="items-center justify-center bg-primary-xlight"
          style={{ width: 80, height: 80, borderRadius: 24, marginBottom: 20 }}
        >
          <DashboardLargeIcon />
        </View>
        <Text className="text-dark font-extrabold text-center" style={{ fontSize: isSmallDevice ? 18 : 20, marginBottom: 8 }}>
          Coming Soon
        </Text>
        <Text className="text-muted text-center" style={{ fontSize: isSmallDevice ? 13 : 14, lineHeight: 20, maxWidth: width * 0.7 }}>
          Build custom dashboards comparing multiple keyword analyses with shareable links.
        </Text>
      </View>
    </View>
  );
}