import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, Easing } from 'react-native';
import { SparkleIcon } from './Icons';

export default function AIChatButton({ onPress, bottom = 24 }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        right: 20,
        bottom,
        zIndex: 100,
        transform: [{ scale: pulseAnim }],
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: -6,
          left: -6,
          right: -6,
          bottom: -6,
          borderRadius: 30,
          backgroundColor: '#6e226e',
          opacity: glowOpacity,
        }}
      />
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: '#6e226e',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#6e226e',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <SparkleIcon size={22} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}