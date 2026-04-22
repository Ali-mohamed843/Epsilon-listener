import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const PauseIcon = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <View style={{ width: width * 0.03, height: width * 0.082, backgroundColor: '#6e226e', borderRadius: 4 }} />
    <View style={{ width: width * 0.03, height: width * 0.082, backgroundColor: '#6e226e', borderRadius: 4 }} />
  </View>
);

export default function Index() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const isSmallDevice  = height < 700;
  const isMediumDevice = height >= 700 && height < 850;

  const logoSize       = isSmallDevice ? 60 : isMediumDevice ? 72 : 80;
  const appNameSize    = isSmallDevice ? 28 : isMediumDevice ? 32 : 36;
  const taglineSize    = isSmallDevice ? 13 : isMediumDevice ? 14 : 15;
  const buttonHeight   = isSmallDevice ? 46 : isMediumDevice ? 50 : 54;
  const buttonFontSize = isSmallDevice ? 14 : 16;
  const logoBorderRadius = isSmallDevice ? 16 : 22;

  const bottomPadding = Platform.select({
    ios:     insets.bottom + (isSmallDevice ? 20 : 30),
    android: insets.bottom + (isSmallDevice ? 24 : 40),
    default: insets.bottom + 30,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    (async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setTimeout(() => router.replace('/(tabs)'), 800);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#2a0830' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#7a2e82', '#5a1a60', '#3d0f42', '#2a0830']}
        locations={[0, 0.35, 0.65, 1]}
        start={{ x: 0.6, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={{ flex: 1, paddingTop: insets.top, paddingBottom: bottomPadding }}
      >
        <Animated.View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: width * 0.1,
            paddingBottom: isSmallDevice ? 20 : 40,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View
            style={{
              width: logoSize,
              height: logoSize,
              borderRadius: logoBorderRadius,
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: isSmallDevice ? 16 : 22,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 32,
              elevation: 12,
            }}
          >
            <PauseIcon />
          </View>

          <Text
            style={{
              fontSize: appNameSize,
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: -0.5,
              marginBottom: isSmallDevice ? 6 : 10,
            }}
          >
            epsilon
          </Text>

          <Text
            style={{
              fontSize: taglineSize,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: taglineSize * 1.55,
              maxWidth: width * 0.56,
              fontWeight: '400',
              textAlign: 'center',
            }}
          >
            Social intelligence & crisis monitoring platform
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            paddingHorizontal: width * 0.07,
            gap: isSmallDevice ? 10 : 14,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.9}
            style={{
              width: '100%',
              height: buttonHeight,
              borderRadius: 32,
              backgroundColor: '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: buttonFontSize,
                fontWeight: '700',
                color: '#3d0f42',
                letterSpacing: 0.2,
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}