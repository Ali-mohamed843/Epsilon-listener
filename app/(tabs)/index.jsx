import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const LogoIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  </Svg>
);

const CalendarIcon = ({ size = 11, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Rect x={3} y={4} width={18} height={18} rx={2} />
    <Line x1={16} y1={2} x2={16} y2={6} />
    <Line x1={8} y1={2} x2={8} y2={6} />
    <Line x1={3} y1={10} x2={21} y2={10} />
  </Svg>
);

const ArrowRightIcon = ({ size = 14, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

const SearchPlusIcon = ({ size = 20, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={11} cy={11} r={8} />
    <Line x1={21} y1={21} x2={16.65} y2={16.65} />
    <Line x1={8} y1={11} x2={14} y2={11} />
    <Line x1={11} y1={8} x2={11} y2={14} />
  </Svg>
);

const getStatusStyle = (status) => {
  switch (status) {
    case 'live': return { bg: '#e6f9f4', color: '#00a878' };
    case 'updating': return { bg: '#fff7e0', color: '#d48a00' };
    case 'done': return { bg: '#f0f0f0', color: '#777' };
    default: return { bg: '#f0f0f0', color: '#777' };
  }
};

const RecentKeywordCard = ({ keyword, isSmallDevice, onPress }) => {
  const statusStyle = getStatusStyle(keyword.status);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white overflow-hidden mb-3"
      style={{
        borderRadius: 16,
        shadowColor: 'rgba(110,34,110,0.07)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View
        className="flex-row items-center"
        style={{
          padding: isSmallDevice ? 12 : 16,
          gap: isSmallDevice ? 10 : 14,
        }}
      >

        <View className="flex-1" style={{ minWidth: 0 }}>
          <View className="flex-row items-center justify-between" style={{ marginBottom: 4 }}>
            <Text
              className="text-dark font-bold flex-1"
              style={{ fontSize: isSmallDevice ? 13.5 : 14.5 }}
              numberOfLines={1}
            >
              {keyword.name}
            </Text>
            <View
              style={{
                backgroundColor: statusStyle.bg,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 20,
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '700',
                  color: statusStyle.color,
                  letterSpacing: 0.4,
                }}
              >
                {keyword.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center flex-wrap" style={{ gap: 6 }}>
            {keyword.platforms.map((platform, index) => (
              <View
                key={index}
                className="bg-primary-xlight"
                style={{
                  paddingHorizontal: 7,
                  paddingVertical: 1.5,
                  borderRadius: 12,
                }}
              >
                <Text
                  className="text-primary"
                  style={{ fontSize: 10, fontWeight: '600' }}
                >
                  {platform}
                </Text>
              </View>
            ))}
            <View className="flex-row items-center" style={{ gap: 3 }}>
              <CalendarIcon size={10} />
              <Text className="text-muted" style={{ fontSize: 10 }}>
                {keyword.dateRange}
              </Text>
            </View>
          </View>
        </View>

        <View
          className="items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#f3e6f3',
          }}
        >
          <ArrowRightIcon size={12} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isSmallDevice = height < 700;
  const isMediumDevice = height >= 700 && height < 850;

  const welcomeNameSize = isSmallDevice ? 22 : isMediumDevice ? 24 : 26;
  const statNumSize = isSmallDevice ? 18 : 20;
  const logoIconSize = isSmallDevice ? 32 : 36;
  const avatarSize = isSmallDevice ? 36 : 40;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentKeywords = [
    {
      id: 1,
      name: 'Climate Summit 2026',
      platforms: ['Twitter', 'Instagram'],
      dateRange: '01 Mar – 31 Mar 2026',
      status: 'live',
    },
    {
      id: 2,
      name: 'Tech Layoffs Wave',
      platforms: ['Twitter', 'LinkedIn'],
      dateRange: '15 Feb – 15 Mar 2026',
      status: 'updating',
    },
    {
      id: 3,
      name: 'Renewable Energy Egypt',
      platforms: ['Facebook', 'Youtube'],
      dateRange: '01 Jan – 28 Feb 2026',
      status: 'done',
    },
    {
      id: 4,
      name: 'Gaza Ceasefire Talks',
      platforms: ['Twitter', 'Tiktok', 'Snapchat'],
      dateRange: '10 Mar – 17 Mar 2026',
      status: 'live',
    },
  ];

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} bounces={false}>
        <View
          className="bg-primary overflow-hidden"
          style={{
            paddingTop: insets.top || StatusBar.currentHeight || 0,
            paddingBottom: isSmallDevice ? 20 : 28,
            paddingHorizontal: width * 0.06,
          }}
        >
          <View
            className="absolute rounded-full"
            style={{
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              backgroundColor: 'rgba(255,255,255,0.06)',
            }}
          />
          <View
            className="absolute rounded-full"
            style={{
              bottom: -40,
              left: -40,
              width: 140,
              height: 140,
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          />

          <View
            className="flex-row justify-between items-center"
            style={{ marginBottom: isSmallDevice ? 16 : 20, marginTop: 8 }}
          >
            <View className="flex-row items-center" style={{ gap: 10 }}>
              <View
                className="items-center justify-center rounded-xl"
                style={{
                  width: logoIconSize,
                  height: logoIconSize,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                }}
              >
                <LogoIcon size={logoIconSize * 0.55} />
              </View>
              <Text
                className="text-white font-extrabold"
                style={{ fontSize: isSmallDevice ? 16 : 18, letterSpacing: -0.3 }}
              >
                epsilon
              </Text>
            </View>

            <TouchableOpacity
              className="items-center justify-center rounded-full"
              style={{
                width: avatarSize,
                height: avatarSize,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.4)',
              }}
            >
              <Text
                className="text-white font-bold"
                style={{ fontSize: isSmallDevice ? 14 : 16 }}
              >
                A
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text
              className="uppercase"
              style={{
                fontSize: isSmallDevice ? 11 : 13,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: 0.5,
                marginBottom: 2,
              }}
            >
              {getGreeting()}
            </Text>
            <Text
              className="text-white font-extrabold"
              style={{ fontSize: welcomeNameSize, letterSpacing: -0.5 }}
            >
              Welcome, ali
            </Text>
            <Text
              style={{
                fontSize: isSmallDevice ? 12 : 13,
                color: 'rgba(255,255,255,0.6)',
                marginTop: 4,
              }}
            >
              Monitor · Analyze · Act
            </Text>
          </View>
        </View>

        <View
          className="bg-white flex-row justify-around"
          style={{
            marginHorizontal: width * 0.06,
            marginTop: -20,
            borderRadius: 16,
            padding: isSmallDevice ? 14 : 16,
            shadowColor: 'rgba(110,34,110,0.12)',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 1,
            shadowRadius: 24,
            elevation: 6,
          }}
        >
          <View className="items-center">
            <Text
              className="text-primary font-extrabold"
              style={{ fontSize: statNumSize }}
            >
              12
            </Text>
            <Text
              className="text-muted"
              style={{ fontSize: 11, marginTop: 2 }}
            >
              Keywords
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#ede0ed', borderRadius: 2 }} />
          <View className="items-center">
            <Text
              className="text-primary font-extrabold"
              style={{ fontSize: statNumSize }}
            >
              8
            </Text>
            <Text
              className="text-muted"
              style={{ fontSize: 11, marginTop: 2 }}
            >
              Profiles
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#ede0ed', borderRadius: 2 }} />
          <View className="items-center">
            <Text
              className="text-primary font-extrabold"
              style={{ fontSize: statNumSize }}
            >
              5
            </Text>
            <Text
              className="text-muted"
              style={{ fontSize: 11, marginTop: 2 }}
            >
              Dashboards
            </Text>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: width * 0.05,
            paddingTop: isSmallDevice ? 20 : 28,
            paddingBottom: 32,
          }}
        >
          <View
            className="flex-row items-center justify-between"
            style={{ marginBottom: isSmallDevice ? 12 : 14 }}
          >
            <Text
              className="text-muted font-bold uppercase"
              style={{
                fontSize: isSmallDevice ? 12 : 14,
                letterSpacing: 1.2,
              }}
            >
              Recent Keywords
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/keywords')}>
              <Text
                className="text-primary font-semibold"
                style={{ fontSize: isSmallDevice ? 12 : 13 }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {recentKeywords.map((keyword) => (
            <RecentKeywordCard
              key={keyword.id}
              keyword={keyword}
              isSmallDevice={isSmallDevice}
              onPress={() => router.push(`/pages/details/${keyword.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}