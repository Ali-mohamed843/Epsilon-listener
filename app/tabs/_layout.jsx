import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';

const HomeIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const ProductsIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={2} y={3} width={20} height={14} rx={2} />
    <Line x1={8} y1={21} x2={16} y2={21} />
    <Line x1={12} y1={17} x2={12} y2={21} />
  </Svg>
);

const PackagesIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 12V22H4V12" />
    <Path d="M22 7H2v5h20V7z" />
    <Path d="M12 22V7" />
    <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </Svg>
);

const ProfileIcon = ({ color, size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Svg>
);

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#6e226e',
        tabBarInactiveTintColor: '#8e7a8e',
        tabBarLabelStyle: {
          fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0e8f0',
          paddingTop: 12,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
          height: 70 + (insets.bottom > 0 ? insets.bottom : 0),
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: focused ? '#f3e6f3' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HomeIcon color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: focused ? '#f3e6f3' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ProductsIcon color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="packages"
        options={{
          title: 'Packages',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: focused ? '#f3e6f3' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PackagesIcon color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: focused ? '#f3e6f3' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ProfileIcon color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}