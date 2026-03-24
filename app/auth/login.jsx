import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Polyline, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const MailIcon = ({ size = 17, color = '#c8b2c8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Polyline points="22,6 12,13 2,6" />
  </Svg>
);

const LockIcon = ({ size = 17, color = '#c8b2c8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const EyeIcon = ({ size = 17, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx={12} cy={12} r={3} />
  </Svg>
);

const EyeOffIcon = ({ size = 17, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <Line x1={1} y1={1} x2={23} y2={23} />
  </Svg>
);

const ArrowIcon = ({ size = 18, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={5} y1={12} x2={19} y2={12} />
    <Polyline points="12,5 19,12 12,19" />
  </Svg>
);

const GoogleIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </Svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1877f2">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

const LogoIcon = ({ size = 38 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  </Svg>
);

export default function Login() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSmallDevice = height < 700;
  const isMediumDevice = height >= 700 && height < 850;

  const heroHeight = isSmallDevice ? height * 0.26 : isMediumDevice ? height * 0.28 : height * 0.3;
  const logoRingSize = isSmallDevice ? 56 : isMediumDevice ? 64 : 72;
  const heroTitleSize = isSmallDevice ? 22 : isMediumDevice ? 25 : 28;
  const heroSubSize = isSmallDevice ? 12 : isMediumDevice ? 13 : 14;
  const formHeadingSize = isSmallDevice ? 18 : isMediumDevice ? 20 : 22;
  const inputHeight = isSmallDevice ? 46 : isMediumDevice ? 50 : 52;
  const buttonHeight = isSmallDevice ? 46 : isMediumDevice ? 50 : 52;
  const socialBtnHeight = isSmallDevice ? 42 : isMediumDevice ? 46 : 48;
  const inputFontSize = isSmallDevice ? 14 : 15;
  const labelSize = isSmallDevice ? 10 : 11;

  const handleSignIn = () => {
    router.push('/tabs/home');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="bg-primary overflow-hidden"
            style={{
              paddingTop: insets.top || StatusBar.currentHeight || 0,
              height: heroHeight + (insets.top || StatusBar.currentHeight || 0),
            }}
          >
            <View
              className="absolute rounded-full"
              style={{
                top: -80,
                right: -80,
                width: 260,
                height: 260,
                backgroundColor: 'rgba(255,255,255,0.07)',
              }}
            />
            <View
              className="absolute rounded-full"
              style={{
                bottom: -60,
                left: -60,
                width: 200,
                height: 200,
                backgroundColor: 'rgba(255,255,255,0.05)',
              }}
            />
            <View
              className="absolute rounded-full"
              style={{
                top: 30 + (insets.top || 0),
                left: 30,
                width: 100,
                height: 100,
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
            />

            <View
              className="flex-1 items-center justify-center"
              style={{ paddingHorizontal: width * 0.08 }}
            >
              <View
                className="items-center justify-center rounded-2xl"
                style={{
                  width: logoRingSize,
                  height: logoRingSize,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.25)',
                  marginBottom: isSmallDevice ? 10 : 16,
                }}
              >
                <LogoIcon size={logoRingSize * 0.53} />
              </View>

              <Text
                className="text-white font-extrabold"
                style={{
                  fontSize: heroTitleSize,
                  letterSpacing: -0.5,
                  marginBottom: 6,
                }}
              >
                epsilon
              </Text>

              <Text
                className="text-center"
                style={{
                  fontSize: heroSubSize,
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: heroSubSize * 1.5,
                  maxWidth: width * 0.6,
                }}
              >
                Social intelligence & crisis monitoring platform
              </Text>
            </View>
          </View>

          <View
            className="flex-1 bg-surface rounded-t-[32px]"
            style={{
              marginTop: -24,
              paddingTop: isSmallDevice ? 22 : 28,
              paddingHorizontal: width * 0.06,
              paddingBottom: Math.max(insets.bottom, 16) + 20,
              shadowColor: 'rgba(110,34,110,0.1)',
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 1,
              shadowRadius: 32,
              elevation: 10,
            }}
          >
            <Text
              className="text-dark font-extrabold"
              style={{
                fontSize: formHeadingSize,
                letterSpacing: -0.3,
                marginBottom: 4,
              }}
            >
              Welcome back 👋
            </Text>

            <Text
              className="text-muted"
              style={{
                fontSize: isSmallDevice ? 12.5 : 13.5,
                marginBottom: isSmallDevice ? 18 : 24,
                lineHeight: 20,
              }}
            >
              Sign in to your account to continue
            </Text>

            <Text
              className="text-muted font-bold uppercase"
              style={{
                fontSize: labelSize,
                letterSpacing: 1,
                marginBottom: 7,
              }}
            >
              Email Address
            </Text>
            <View
              className="flex-row items-center bg-surface2 border-border px-3.5"
              style={{
                borderWidth: 1.5,
                borderRadius: 14,
                height: inputHeight,
                marginBottom: 16,
              }}
            >
              <MailIcon />
              <TextInput
                className="flex-1 text-dark ml-3"
                style={{ fontSize: inputFontSize }}
                placeholder="you@example.com"
                placeholderTextColor="#c8b2c8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text
              className="text-muted font-bold uppercase"
              style={{
                fontSize: labelSize,
                letterSpacing: 1,
                marginBottom: 7,
              }}
            >
              Password
            </Text>
            <View
              className="flex-row items-center bg-surface2 border-border px-3.5"
              style={{
                borderWidth: 1.5,
                borderRadius: 14,
                height: inputHeight,
                marginBottom: 8,
              }}
            >
              <LockIcon />
              <TextInput
                className="flex-1 text-dark ml-3"
                style={{ fontSize: inputFontSize }}
                placeholder="Enter your password"
                placeholderTextColor="#c8b2c8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="self-end mb-4">
              <Text className="text-primary font-semibold text-[13px]">
                Forgot password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSignIn}
              className="w-full flex-row items-center justify-center rounded-2xl"
              style={{
                height: buttonHeight,
                backgroundColor: isLoading ? '#00a878' : '#6e226e',
                gap: 8,
                shadowColor: '#6e226e',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.32,
                shadowRadius: 24,
                elevation: 8,
                marginBottom: isSmallDevice ? 16 : 20,
              }}
            >
              <Text className="text-white font-extrabold text-base">
                {isLoading ? 'Welcome back!' : 'Sign In'}
              </Text>
              <ArrowIcon />
            </TouchableOpacity>

            <View
              className="flex-row items-center"
              style={{
                marginBottom: isSmallDevice ? 16 : 20,
                gap: 12,
              }}
            />

            <View className="flex-row justify-center items-center">
              <Text className="text-muted text-[13.5px]">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity>
                <Text className="text-primary font-bold text-[13.5px]">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}