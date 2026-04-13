import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';

const HomeIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const KeywordsIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={11} cy={11} r={8} />
    <Line x1={21} y1={21} x2={16.65} y2={16.65} />
    <Line x1={8} y1={11} x2={14} y2={11} />
    <Line x1={11} y1={8} x2={11} y2={14} />
  </Svg>
);

const ProfilesIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Svg>
);

const DashboardIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={3} width={7} height={7} />
    <Rect x={14} y={3} width={7} height={7} />
    <Rect x={14} y={14} width={7} height={7} />
    <Rect x={3} y={14} width={7} height={7} />
  </Svg>
);

const TABS = [
  { name: 'Home',      route: '/',          icon: HomeIcon      },
  { name: 'Keywords',  route: '/keywords',  icon: KeywordsIcon  },
  { name: 'Profiles',  route: '/profiles',  icon: ProfilesIcon  },
  { name: 'Dashboard', route: '/dashboard', icon: DashboardIcon },
];

export default function BottomTabBar() {
  const router   = useRouter();
  const pathname = usePathname();
  const insets   = useSafeAreaInsets();

  const isActive = (route) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  };

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#f0e8f0',
      paddingTop: 8,
      paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
      height: 64 + (insets.bottom > 0 ? insets.bottom : 0),
    }}>
      {TABS.map((tab) => {
        const active = isActive(tab.route);
        const color  = active ? '#6e226e' : '#8e7a8e';
        const Icon   = tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.route)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.7}
          >
            <View style={{
              width: 37, height: 37, borderRadius: 12, marginBottom: 2,
              backgroundColor: active ? '#f3e6f3' : 'transparent',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon color={color} />
            </View>
            <Text style={{
              fontSize: 10, fontWeight: '500', color,
              fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
            }}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}