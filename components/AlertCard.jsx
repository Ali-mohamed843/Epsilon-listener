import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  InfoIcon,
  TrendingUpIcon,
  ZapIcon,
  HashIcon,
  SmileIcon,
  UsersIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  XIcon,
} from './Icons';

const PRIORITY_CONFIG = {
  critical: {
    bg: '#fff0f3',
    border: '#e8365d',
    iconBg: '#ffd0db',
    titleColor: '#e8365d',
    badgeBg: '#e8365d',
    badgeText: '#fff',
    label: 'Critical',
  },
  warning: {
    bg: '#fffbeb',
    border: '#f59e0b',
    iconBg: '#fef3c7',
    titleColor: '#d97706',
    badgeBg: '#f59e0b',
    badgeText: '#fff',
    label: 'Warning',
  },
  info: {
    bg: '#eff6ff',
    border: '#3b82f6',
    iconBg: '#dbeafe',
    titleColor: '#2563eb',
    badgeBg: '#3b82f6',
    badgeText: '#fff',
    label: 'Info',
  },
  positive: {
    bg: '#f0fdf4',
    border: '#00a878',
    iconBg: '#d1fae5',
    titleColor: '#047857',
    badgeBg: '#00a878',
    badgeText: '#fff',
    label: 'Positive',
  },
};

const CATEGORY_ICONS = {
  fake_accounts: function(color) { return <UsersIcon size={16} color={color} />; },
  sentiment: function(color) { return <SmileIcon size={16} color={color} />; },
  engagement: function(color) { return <ZapIcon size={16} color={color} />; },
  spike: function(color) { return <TrendingUpIcon size={16} color={color} />; },
  trend: function(color) { return <TrendingUpIcon size={16} color={color} />; },
  hashtag: function(color) { return <HashIcon size={16} color={color} />; },
};

function getPriorityIcon(priority, color) {
  if (priority === 'critical') return <AlertOctagonIcon size={16} color={color} />;
  if (priority === 'warning') return <AlertTriangleIcon size={14} color={color} />;
  if (priority === 'positive') return <ShieldCheckIcon size={16} color={color} />;
  return <InfoIcon size={16} color={color} />;
}

export default function AlertCard({ alert, index, onViewReport, onDismiss }) {
  var config = PRIORITY_CONFIG[alert.priority] || PRIORITY_CONFIG.info;
  var fadeAnim = useRef(new Animated.Value(0)).current;
  var slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(function() {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  var categoryIcon = CATEGORY_ICONS[alert.category];
  var iconElement = categoryIcon
    ? categoryIcon(config.border)
    : getPriorityIcon(alert.priority, config.border);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        marginBottom: 12,
      }}
    >
      <View
        style={{
          backgroundColor: config.bg,
          borderRadius: 18,
          borderLeftWidth: 4,
          borderLeftColor: config.border,
          padding: 16,
          shadowColor: 'rgba(0,0,0,0.06)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: config.iconBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {iconElement}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '800',
                    color: config.titleColor,
                    flex: 1,
                    letterSpacing: -0.2,
                  }}
                  numberOfLines={1}
                >
                  {alert.title}
                </Text>
                <View
                  style={{
                    backgroundColor: config.badgeBg,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 9, fontWeight: '700', color: config.badgeText, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {config.label}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 11, color: '#9e859e', fontWeight: '500' }}>
                {alert.reportName}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={function() { onDismiss(alert.id); }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: 'rgba(0,0,0,0.05)',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 8,
            }}
          >
            <XIcon size={14} color="#9e859e" />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: 13,
            color: '#1a0a1a',
            lineHeight: 19,
            fontWeight: '400',
            marginBottom: 12,
            paddingLeft: 44,
          }}
        >
          {alert.message}
        </Text>

        <TouchableOpacity
          onPress={function() { onViewReport(alert); }}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
            backgroundColor: '#fff',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 10,
            gap: 4,
            shadowColor: 'rgba(0,0,0,0.05)',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: config.border }}>
            View Report
          </Text>
          <ChevronRightIcon size={14} color={config.border} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}