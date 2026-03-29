import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SparkleIcon, RefreshCWIcon } from './Icons';

const { width } = Dimensions.get('window');

const ShimmerLine = ({ widthPercent, delay = 0 }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{
        height: 10,
        borderRadius: 5,
        backgroundColor: '#e8cfe8',
        width: widthPercent,
        marginBottom: 8,
        opacity,
      }}
    />
  );
};

const LoadingShimmer = () => (
  <View style={{ paddingTop: 4 }}>
    <ShimmerLine widthPercent="95%" delay={0} />
    <ShimmerLine widthPercent="88%" delay={150} />
    <ShimmerLine widthPercent="75%" delay={300} />
    <ShimmerLine widthPercent="60%" delay={450} />
  </View>
);

export default function AISummaryCard({ onGenerate, isSmallDevice }) {
  const [status, setStatus] = useState('idle');
  const [summaryText, setSummaryText] = useState('');
  const [errorText, setErrorText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const animateIn = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleGenerate = async () => {
    setStatus('loading');
    setErrorText('');
    try {
      const result = await onGenerate();
      setSummaryText(result);
      setStatus('done');
      animateIn();
    } catch (err) {
      setErrorText(err.message || 'Failed to generate summary');
      setStatus('error');
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: isSmallDevice ? 14 : 16,
        marginBottom: 14,
        shadowColor: 'rgba(110,34,110,0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1.5,
        borderColor: '#f3e6f3',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: status === 'idle' ? 0 : 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: '#f3e6f3',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SparkleIcon size={16} color="#6e226e" />
          </View>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '800',
                color: '#1a0a1a',
                letterSpacing: -0.2,
              }}
            >
              AI Summary
            </Text>
            <Text style={{ fontSize: 10.5, color: '#9e859e', marginTop: 1 }}>
              Powered by Gemini
            </Text>
          </View>
        </View>

        {status === 'done' && (
          <TouchableOpacity
            onPress={handleRegenerate}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f3e6f3',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              gap: 4,
            }}
          >
            <RefreshCWIcon size={12} color="#6e226e" />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#6e226e' }}>
              Regenerate
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {status === 'idle' && (
        <TouchableOpacity
          onPress={handleGenerate}
          activeOpacity={0.85}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#6e226e',
            borderRadius: 12,
            paddingVertical: isSmallDevice ? 12 : 14,
            marginTop: 12,
            gap: 8,
            shadowColor: '#6e226e',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <SparkleIcon size={16} color="#fff" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
            Generate AI Summary
          </Text>
        </TouchableOpacity>
      )}

      {status === 'loading' && <LoadingShimmer />}

      {status === 'done' && (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <View
            style={{
              backgroundColor: '#faf5fa',
              borderRadius: 12,
              padding: 14,
              borderLeftWidth: 3,
              borderLeftColor: '#6e226e',
            }}
          >
            <Text
              style={{
                fontSize: 13.5,
                color: '#1a0a1a',
                lineHeight: 21,
                fontWeight: '400',
              }}
            >
              {summaryText}
            </Text>
          </View>
        </Animated.View>
      )}

      {status === 'error' && (
        <View style={{ marginTop: 4 }}>
          <View
            style={{
              backgroundColor: '#fff0f3',
              borderRadius: 12,
              padding: 14,
              borderLeftWidth: 3,
              borderLeftColor: '#e8365d',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 12.5, color: '#e8365d', lineHeight: 18, fontWeight: '500' }}>
              {errorText}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleGenerate}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#6e226e',
              borderRadius: 12,
              paddingVertical: 12,
              gap: 8,
            }}
          >
            <RefreshCWIcon size={14} color="#fff" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}