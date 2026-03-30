import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing, Dimensions } from 'react-native';
import { SparkleIcon, TrendingUpIcon, ShieldCheckIcon, AlertTriangleIcon } from './Icons';
import Svg, { Path, Circle } from 'react-native-svg';

var { width } = Dimensions.get('window');

var TrophyIcon = function(props) {
  var size = props.size || 20;
  var color = props.color || '#f59e0b';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <Path d="M4 22h16" />
      <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </Svg>
  );
};

var ArrowUpIcon = function(props) {
  var size = props.size || 12;
  var color = props.color || '#00a878';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
      <Path d="M12 19V5M5 12l7-7 7 7" />
    </Svg>
  );
};

export function WinnerBanner(props) {
  var data = props.data;
  var isSmallDevice = props.isSmallDevice;
  var fadeAnim = useRef(new Animated.Value(0)).current;
  var scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(function() {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
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
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: isSmallDevice ? 16 : 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#f59e0b',
        shadowColor: 'rgba(245,158,11,0.15)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: '#fffbeb',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrophyIcon size={22} color="#f59e0b" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#d97706', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
            Overall Winner
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a0a1a', letterSpacing: -0.3 }}>
            {data.winner}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 13, color: '#1a0a1a', lineHeight: 19, marginBottom: 12 }}>
        {data.winnerReason}
      </Text>

      <View
        style={{
          backgroundColor: '#fffbeb',
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <TrendingUpIcon size={14} color="#d97706" />
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#d97706' }}>
          Leads in {data.metricsWon} of {data.totalMetrics} metrics
        </Text>
      </View>
    </Animated.View>
  );
}

export function HeadToHeadCard(props) {
  var comparison = props.comparison;
  var items = props.items;
  var index = props.index;
  var fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(function() {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  var winnerIndex = comparison.winner;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        shadowColor: 'rgba(110,34,110,0.06)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#9e859e', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {comparison.metric}
      </Text>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        {items.map(function(item, i) {
          var isWinner = winnerIndex === i;
          return (
            <View
              key={i}
              style={{
                flex: 1,
                backgroundColor: isWinner ? '#f0fdf4' : '#faf5fa',
                borderRadius: 12,
                padding: 12,
                borderWidth: isWinner ? 1.5 : 0,
                borderColor: isWinner ? '#00a878' : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 11, color: '#9e859e', fontWeight: '500', marginBottom: 4 }} numberOfLines={1}>
                {item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: isWinner ? '#00a878' : '#1a0a1a' }}>
                  {comparison.values[i]}
                </Text>
                {isWinner && <ArrowUpIcon size={14} color="#00a878" />}
              </View>
            </View>
          );
        })}
      </View>

      <Text style={{ fontSize: 12, color: '#9e859e', lineHeight: 17, fontStyle: 'italic' }}>
        {comparison.insight}
      </Text>
    </Animated.View>
  );
}

export function SentimentComparisonCard(props) {
  var data = props.data;
  var isSmallDevice = props.isSmallDevice;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: isSmallDevice ? 14 : 16,
        marginBottom: 14,
        shadowColor: 'rgba(110,34,110,0.06)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {data.items.map(function(item, i) {
        var total = item.positive + item.negative + item.neutral;
        var posWidth = total > 0 ? (item.positive / total) * 100 : 33;
        var negWidth = total > 0 ? (item.negative / total) * 100 : 33;
        var neuWidth = total > 0 ? (item.neutral / total) * 100 : 34;

        return (
          <View key={i} style={{ marginBottom: i < data.items.length - 1 ? 16 : 0 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1a0a1a', marginBottom: 8 }}>
              {item.name}
            </Text>

            <View style={{ flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 8 }}>
              <View style={{ width: posWidth + '%', backgroundColor: '#00a878' }} />
              <View style={{ width: negWidth + '%', backgroundColor: '#e8365d' }} />
              <View style={{ width: neuWidth + '%', backgroundColor: '#f59e0b' }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#00a878' }} />
                <Text style={{ fontSize: 11, color: '#9e859e' }}>{item.positive}%</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#e8365d' }} />
                <Text style={{ fontSize: 11, color: '#9e859e' }}>{item.negative}%</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' }} />
                <Text style={{ fontSize: 11, color: '#9e859e' }}>{item.neutral}%</Text>
              </View>
            </View>
          </View>
        );
      })}

      <View style={{ backgroundColor: '#faf5fa', borderRadius: 10, padding: 10, marginTop: 12 }}>
        <Text style={{ fontSize: 12, color: '#6e226e', lineHeight: 17, fontStyle: 'italic' }}>
          {data.insight}
        </Text>
      </View>
    </View>
  );
}

export function RiskComparisonCard(props) {
  var data = props.data;

  var getRiskColor = function(level) {
    if (level === 'High') return { bg: '#fff0f3', color: '#e8365d', iconBg: '#ffd0db' };
    if (level === 'Medium') return { bg: '#fffbeb', color: '#d97706', iconBg: '#fef3c7' };
    return { bg: '#f0fdf4', color: '#047857', iconBg: '#d1fae5' };
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        shadowColor: 'rgba(110,34,110,0.06)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        {data.items.map(function(item, i) {
          var riskStyle = getRiskColor(item.riskLevel);
          return (
            <View
              key={i}
              style={{
                flex: 1,
                backgroundColor: riskStyle.bg,
                borderRadius: 14,
                padding: 14,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: riskStyle.iconBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}
              >
                {item.riskLevel === 'Low'
                  ? <ShieldCheckIcon size={16} color={riskStyle.color} />
                  : <AlertTriangleIcon size={14} color={riskStyle.color} />
                }
              </View>
              <Text style={{ fontSize: 11, color: '#9e859e', marginBottom: 4 }} numberOfLines={1}>
                {item.name.length > 14 ? item.name.substring(0, 14) + '...' : item.name}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: riskStyle.color, marginBottom: 2 }}>
                {item.fakePercent}%
              </Text>
              <Text style={{ fontSize: 10, fontWeight: '700', color: riskStyle.color, textTransform: 'uppercase' }}>
                {item.riskLevel} Risk
              </Text>
            </View>
          );
        })}
      </View>

      <View style={{ backgroundColor: '#faf5fa', borderRadius: 10, padding: 10 }}>
        <Text style={{ fontSize: 12, color: '#6e226e', lineHeight: 17, fontStyle: 'italic' }}>
          {data.insight}
        </Text>
      </View>
    </View>
  );
}

export function TakeawaysCard(props) {
  var takeaways = props.takeaways;
  var recommendation = props.recommendation;
  var isSmallDevice = props.isSmallDevice;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: isSmallDevice ? 14 : 16,
        marginBottom: 14,
        shadowColor: 'rgba(110,34,110,0.06)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {takeaways.map(function(takeaway, i) {
        var colors = ['#6e226e', '#3b82f6', '#00a878', '#f59e0b'];
        var bgColors = ['#f3e6f3', '#e8f0ff', '#e6f9f4', '#fffbeb'];
        var color = colors[i % colors.length];
        var bgColor = bgColors[i % bgColors.length];

        return (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: i < takeaways.length - 1 ? 12 : 16,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 8,
                backgroundColor: bgColor,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 1,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '800', color: color }}>
                {i + 1}
              </Text>
            </View>
            <Text style={{ flex: 1, fontSize: 13, color: '#1a0a1a', lineHeight: 19 }}>
              {takeaway}
            </Text>
          </View>
        );
      })}

      <View
        style={{
          backgroundColor: '#f3e6f3',
          borderRadius: 14,
          padding: 14,
          borderLeftWidth: 3,
          borderLeftColor: '#6e226e',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <SparkleIcon size={14} color="#6e226e" />
          <Text style={{ fontSize: 12, fontWeight: '800', color: '#6e226e', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            AI Recommendation
          </Text>
        </View>
        <Text style={{ fontSize: 13, color: '#1a0a1a', lineHeight: 19 }}>
          {recommendation}
        </Text>
      </View>
    </View>
  );
}