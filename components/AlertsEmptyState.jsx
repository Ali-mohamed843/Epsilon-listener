import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { ShieldCheckIcon, BellIcon } from './Icons';

export default function AlertsEmptyState({ isLoading }) {
  var pulseAnim = useRef(new Animated.Value(0.4)).current;
  var fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(function() {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 }}>
        <Animated.View
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            backgroundColor: '#f3e6f3',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            opacity: pulseAnim,
          }}
        >
          <BellIcon size={32} color="#6e226e" />
        </Animated.View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a0a1a', marginBottom: 6 }}>
          Analyzing Reports...
        </Text>
        <Text style={{ fontSize: 13, color: '#9e859e', textAlign: 'center', lineHeight: 19, paddingHorizontal: 40 }}>
          AI is scanning all your keywords and profiles for anomalies, risks, and trends
        </Text>

        <View style={{ marginTop: 24, gap: 10, width: '100%', paddingHorizontal: 20 }}>
          {[0.92, 0.78, 0.85, 0.65].map(function(w, i) {
            var shimmerAnim = useRef(new Animated.Value(0.3)).current;

            useEffect(function() {
              Animated.loop(
                Animated.sequence([
                  Animated.delay(i * 150),
                  Animated.timing(shimmerAnim, {
                    toValue: 0.7,
                    duration: 1000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                  }),
                  Animated.timing(shimmerAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    easing: Easing.ease,
                    useNativeDriver: true,
                  }),
                ])
              ).start();
            }, []);

            return (
              <Animated.View
                key={i}
                style={{
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: '#f3e6f3',
                  opacity: shimmerAnim,
                  width: (w * 100) + '%',
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
        opacity: fadeAnim,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          backgroundColor: '#e6f9f4',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <ShieldCheckIcon size={32} color="#00a878" />
      </View>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a0a1a', marginBottom: 6 }}>
        All Clear!
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: '#9e859e',
          textAlign: 'center',
          lineHeight: 19,
          paddingHorizontal: 40,
        }}
      >
        No alerts right now. Your keywords and profiles are performing within normal parameters.
      </Text>
    </Animated.View>
  );
}