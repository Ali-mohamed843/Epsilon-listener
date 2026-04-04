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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Polyline, Line } from 'react-native-svg';
import { loginUser } from '../../api/loginApi';

const { width, height } = Dimensions.get('window');

const MailIcon = (props) => {
  const size = props.size || 17;
  const color = props.color || '#c8b2c8';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <Polyline points="22,6 12,13 2,6" />
    </Svg>
  );
};

const LockIcon = (props) => {
  const size = props.size || 17;
  const color = props.color || '#c8b2c8';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
};

const EyeIcon = (props) => {
  const size = props.size || 17;
  const color = props.color || '#9e859e';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx={12} cy={12} r={3} />
    </Svg>
  );
};

const EyeOffIcon = (props) => {
  const size = props.size || 17;
  const color = props.color || '#9e859e';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <Line x1={1} y1={1} x2={23} y2={23} />
    </Svg>
  );
};

const ArrowIcon = (props) => {
  const size = props.size || 18;
  const color = props.color || '#fff';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <Line x1={5} y1={12} x2={19} y2={12} />
      <Polyline points="12,5 19,12 12,19" />
    </Svg>
  );
};

const CheckIcon = (props) => {
  const size = props.size || 18;
  const color = props.color || '#fff';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  );
};

const AlertIcon = (props) => {
  const size = props.size || 16;
  const color = props.color || '#e8365d';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Circle cx={12} cy={12} r={10} />
      <Line x1={12} y1={8} x2={12} y2={12} />
      <Line x1={12} y1={16} x2={12.01} y2={16} />
    </Svg>
  );
};

const LogoIcon = (props) => {
  const size = props.size || 38;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
      <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
    </Svg>
  );
};

export default function Login() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const isSmallDevice = height < 700;
  const isMediumDevice = height >= 700 && height < 850;

  const heroHeight = isSmallDevice ? height * 0.26 : isMediumDevice ? height * 0.28 : height * 0.3;
  const logoRingSize = isSmallDevice ? 56 : isMediumDevice ? 64 : 72;
  const heroTitleSize = isSmallDevice ? 22 : isMediumDevice ? 25 : 28;
  const heroSubSize = isSmallDevice ? 12 : isMediumDevice ? 13 : 14;
  const formHeadingSize = isSmallDevice ? 18 : isMediumDevice ? 20 : 22;
  const inputHeight = isSmallDevice ? 46 : isMediumDevice ? 50 : 52;
  const buttonHeight = isSmallDevice ? 46 : isMediumDevice ? 50 : 52;
  const inputFontSize = isSmallDevice ? 14 : 15;
  const labelSize = isSmallDevice ? 10 : 11;

  const validateEmail = (emailText) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailText);
  };

  const handleSignIn = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    const result = await loginUser({ email: email.trim(), password });

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const getButtonStyle = () => {
    if (isSuccess) return '#00a878';
    if (isLoading) return '#9b3d9b';
    return '#6e226e';
  };

  const getButtonText = () => {
    if (isSuccess) return 'Welcome back!';
    if (isLoading) return 'Signing in...';
    return 'Sign In';
  };

  const renderButtonContent = () => {
    if (isSuccess) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text className="text-white font-extrabold text-base">{getButtonText()}</Text>
          <CheckIcon />
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <ActivityIndicator size="small" color="#fff" />
          <Text className="text-white font-extrabold text-base">{getButtonText()}</Text>
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text className="text-white font-extrabold text-base">{getButtonText()}</Text>
        <ArrowIcon />
      </View>
    );
  };

  const clearError = () => {
    if (error) setError('');
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
              style={{ top: -80, right: -80, width: 260, height: 260, backgroundColor: 'rgba(255,255,255,0.07)' }}
            />
            <View
              className="absolute rounded-full"
              style={{ bottom: -60, left: -60, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.05)' }}
            />
            <View
              className="absolute rounded-full"
              style={{ top: 30 + (insets.top || 0), left: 30, width: 100, height: 100, backgroundColor: 'rgba(255,255,255,0.04)' }}
            />

            <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: width * 0.08 }}>
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
                style={{ fontSize: heroTitleSize, letterSpacing: -0.5, marginBottom: 6 }}
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
              style={{ fontSize: formHeadingSize, letterSpacing: -0.3, marginBottom: 4 }}
            >
              Welcome back 👋
            </Text>

            <Text
              className="text-muted"
              style={{ fontSize: isSmallDevice ? 12.5 : 13.5, marginBottom: isSmallDevice ? 18 : 24, lineHeight: 20 }}
            >
              Sign in to your account to continue
            </Text>

            {error !== '' && (
              <View
                style={{
                  backgroundColor: '#fff0f3',
                  borderRadius: 12,
                  padding: 12,
                  paddingHorizontal: 14,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  borderWidth: 1,
                  borderColor: '#ffd0db',
                }}
              >
                <AlertIcon />
                <Text style={{ flex: 1, fontSize: 13, color: '#e8365d', lineHeight: 18 }}>{error}</Text>
              </View>
            )}

            <Text
              className="text-muted font-bold uppercase"
              style={{ fontSize: labelSize, letterSpacing: 1, marginBottom: 7 }}
            >
              Email Address
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#faf5fa',
                borderWidth: 1.5,
                borderColor: error && !email.trim() ? '#e8365d' : '#ede4ed',
                borderRadius: 14,
                height: inputHeight,
                paddingHorizontal: 14,
                marginBottom: 16,
              }}
            >
              <MailIcon color={error && !email.trim() ? '#e8365d' : '#c8b2c8'} />
              <TextInput
                className="flex-1 text-dark"
                style={{ fontSize: inputFontSize, marginLeft: 12 }}
                placeholder="you@example.com"
                placeholderTextColor="#c8b2c8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(text) => { setEmail(text); clearError(); }}
                editable={!isLoading && !isSuccess}
              />
            </View>

            <Text
              className="text-muted font-bold uppercase"
              style={{ fontSize: labelSize, letterSpacing: 1, marginBottom: 7 }}
            >
              Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#faf5fa',
                borderWidth: 1.5,
                borderColor: error && !password ? '#e8365d' : '#ede4ed',
                borderRadius: 14,
                height: inputHeight,
                paddingHorizontal: 14,
                marginBottom: 8,
              }}
            >
              <LockIcon color={error && !password ? '#e8365d' : '#c8b2c8'} />
              <TextInput
                className="flex-1 text-dark"
                style={{ fontSize: inputFontSize, marginLeft: 12 }}
                placeholder="Enter your password"
                placeholderTextColor="#c8b2c8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => { setPassword(text); clearError(); }}
                editable={!isLoading && !isSuccess}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                disabled={isLoading || isSuccess}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="self-end mb-4" disabled={isLoading || isSuccess}>
              <Text className="text-primary font-semibold text-[13px]">Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSignIn}
              disabled={isLoading || isSuccess}
              className="w-full flex-row items-center justify-center rounded-2xl"
              style={{
                height: buttonHeight,
                backgroundColor: getButtonStyle(),
                gap: 8,
                shadowColor: '#6e226e',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.32,
                shadowRadius: 24,
                elevation: 8,
                marginBottom: isSmallDevice ? 16 : 20,
                opacity: isLoading && !isSuccess ? 0.9 : 1,
              }}
            >
              {renderButtonContent()}
            </TouchableOpacity>

            <View className="flex-row items-center" style={{ marginBottom: isSmallDevice ? 16 : 20, gap: 12 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}