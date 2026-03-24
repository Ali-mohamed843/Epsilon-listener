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
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';
import { useRouter, router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const LogoIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  </Svg>
);

const SearchPlusIcon = ({ size = 28, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={11} cy={11} r={8} />
    <Line x1={21} y1={21} x2={16.65} y2={16.65} />
    <Line x1={8} y1={11} x2={14} y2={11} />
    <Line x1={11} y1={8} x2={11} y2={14} />
  </Svg>
);

const ProfileAnalysisIcon = ({ size = 28, color = '#2563eb' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Svg>
);

const DashboardIcon = ({ size = 28, color = '#e65100' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={3} width={7} height={7} />
    <Rect x={14} y={3} width={7} height={7} />
    <Rect x={14} y={14} width={7} height={7} />
    <Rect x={3} y={14} width={7} height={7} />
  </Svg>
);

const ArrowRightIcon = ({ size = 16, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

const ModuleCard = ({ icon, title, description, iconBgClass, badge, onPress }) => {
  const isSmallDevice = height < 700;
  const cardPadding = isSmallDevice ? 16 : 22;
  const iconSize = isSmallDevice ? 46 : 54;
  const titleSize = isSmallDevice ? 14 : 16;
  const descSize = isSmallDevice ? 11.5 : 12.5;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white flex-row items-center mb-3.5 relative overflow-hidden"
      style={{
        borderRadius: 20,
        padding: cardPadding,
        shadowColor: 'rgba(110,34,110,0.07)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 3,
        gap: isSmallDevice ? 12 : 16,
      }}
    >
      <View
        className={`items-center justify-center ${iconBgClass}`}
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: 16,
        }}
      >
        {icon}
      </View>

      <View className="flex-1">
        <Text
          className="text-dark font-bold"
          style={{
            fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
            fontSize: titleSize,
            letterSpacing: -0.2,
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text
          className="text-muted"
          style={{
            fontSize: descSize,
            lineHeight: descSize * 1.5,
          }}
        >
          {description}
        </Text>
      </View>

      {badge && (
        <View
          className="absolute bg-primary"
          style={{
            top: 14,
            right: 54,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 20,
          }}
        >
          <Text
            className="text-white"
            style={{
              fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 0.4,
            }}
          >
            {badge}
          </Text>
        </View>
      )}

      <View
        className="items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#f3e6f3',
        }}
      >
        <ArrowRightIcon />
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const isSmallDevice = height < 700;
  const isMediumDevice = height >= 700 && height < 850;

  const headerPaddingBottom = isSmallDevice ? 20 : 28;
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

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View
          className="bg-primary overflow-hidden"
          style={{
            paddingTop: insets.top || StatusBar.currentHeight || 0,
            paddingBottom: headerPaddingBottom,
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
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
                  fontSize: isSmallDevice ? 16 : 18,
                  letterSpacing: -0.3,
                }}
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
                style={{
                  fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
                  fontSize: isSmallDevice ? 14 : 16,
                }}
              >
                H
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
              style={{
                fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
                fontSize: welcomeNameSize,
                letterSpacing: -0.5,
              }}
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
              style={{
                fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
                fontSize: statNumSize,
              }}
            >
              12
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 11,
                marginTop: 2,
                letterSpacing: 0.3,
              }}
            >
              Keywords
            </Text>
          </View>

          <View
            style={{
              width: 1,
              backgroundColor: '#ede0ed',
              borderRadius: 2,
            }}
          />

          <View className="items-center">
            <Text
              className="text-primary font-extrabold"
              style={{
                fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
                fontSize: statNumSize,
              }}
            >
              8
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 11,
                marginTop: 2,
                letterSpacing: 0.3,
              }}
            >
              Profiles
            </Text>
          </View>

          <View
            style={{
              width: 1,
              backgroundColor: '#ede0ed',
              borderRadius: 2,
            }}
          />

          <View className="items-center">
            <Text
              className="text-primary font-extrabold"
              style={{
                fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
                fontSize: statNumSize,
              }}
            >
              5
            </Text>
            <Text
              className="text-muted"
              style={{
                fontSize: 11,
                marginTop: 2,
                letterSpacing: 0.3,
              }}
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
          <Text
            className="text-muted font-bold uppercase"
            style={{
              fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
              fontSize: isSmallDevice ? 12 : 14,
              letterSpacing: 1.2,
              marginBottom: isSmallDevice ? 12 : 14,
            }}
          >
            Modules
          </Text>

          <ModuleCard
            icon={<SearchPlusIcon size={isSmallDevice ? 24 : 28} />}
            title="Keyword Analysis"
            description="Track crisis-related terms across social platforms in real time."
            iconBgClass=""
            badge="LIVE"
            onPress={() => router.push('/pages/keyword')}
          />

          <ModuleCard
            icon={<ProfileAnalysisIcon size={isSmallDevice ? 24 : 28} />}
            title="Profile Analysis"
            description="Monitor engagement and activity across social media profiles."
            iconBgClass=""
            onPress={() => {}}
          />

          <ModuleCard
            icon={<DashboardIcon size={isSmallDevice ? 24 : 28} />}
            title="External Dashboard"
            description="Build custom dashboards comparing multiple keyword analyses with shareable links."
            iconBgClass=""
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
}