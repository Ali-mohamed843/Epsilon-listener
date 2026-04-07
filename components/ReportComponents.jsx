import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
export { default as SentimentWordCloudWebView } from './SentimentWordCloudWebView';

const { width } = Dimensions.get('window');

export const FilterChips = ({ label, options, active, onSelect }) => (
  <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ede4ed' }}>
    <Text style={{ fontSize: 10, fontWeight: '700', color: '#9e859e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => onSelect(opt)}
          style={{
            paddingHorizontal: 13,
            paddingVertical: 5,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: active === opt ? '#6e226e' : '#ede4ed',
            backgroundColor: active === opt ? '#6e226e' : 'transparent',
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: active === opt ? '#fff' : '#9e859e' }}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

export const KpiCard = ({ icon, label, value, isPositive }) => (
  <View
    className="bg-white"
    style={{
      borderRadius: 16,
      padding: 14,
      shadowColor: 'rgba(110,34,110,0.06)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    }}
  >
    {icon}
    <View style={{ flex: 1, minWidth: 0 }}>
      <Text style={{ fontSize: 11, color: '#9e859e', lineHeight: 14, marginBottom: 3 }}>{label}</Text>
      <Text style={{ fontSize: 18, fontWeight: '800', color: isPositive ? '#00a878' : '#1a0a1a', lineHeight: 18 }}>{value}</Text>
    </View>
  </View>
);

export const FindingsCard = ({ fakePercent, realPercent, totalAccounts, riskLevel, riskMessage }) => (
  <View className="bg-white" style={{ borderRadius: 16, padding: 16, marginBottom: 10, shadowColor: 'rgba(110,34,110,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2 }}>
    <View className="flex-row" style={{ gap: 8, marginBottom: 12 }}>
      <View style={{ flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', backgroundColor: '#fff0f3' }}>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#ffd0db', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
          <Text style={{ fontSize: 12, color: '#e8365d' }}>✕</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: '800', color: '#e8365d', marginBottom: 2 }}>{fakePercent}%</Text>
        <Text style={{ fontSize: 10, fontWeight: '600', color: '#9e859e' }}>Fake</Text>
      </View>
      <View style={{ flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', backgroundColor: '#e6f9f4' }}>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#b3f0e0', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
          <Text style={{ fontSize: 12, color: '#00a878' }}>✓</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: '800', color: '#00a878', marginBottom: 2 }}>{realPercent}%</Text>
        <Text style={{ fontSize: 10, fontWeight: '600', color: '#9e859e' }}>Real</Text>
      </View>
      <View style={{ flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', backgroundColor: '#f3e6f3' }}>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#e8cfe8', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
          <Text style={{ fontSize: 12, color: '#6e226e' }}>👤</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: '800', color: '#6e226e', marginBottom: 2 }}>{totalAccounts}</Text>
        <Text style={{ fontSize: 10, fontWeight: '600', color: '#9e859e' }}>Accounts</Text>
      </View>
    </View>
    <View style={{ backgroundColor: '#fffbeb', borderRadius: 12, padding: 12, paddingHorizontal: 14, borderLeftWidth: 3, borderLeftColor: '#f59e0b' }}>
      <Text style={{ fontSize: 12, fontWeight: '800', color: '#92400e', marginBottom: 4 }}>⚠ {riskLevel} Risk Detected</Text>
      <Text style={{ fontSize: 11.5, color: '#78350f', lineHeight: 17 }}>{riskMessage}</Text>
    </View>
  </View>
);

export const SentimentWordCloud = ({ title, percentage, words, type, onWordPress }) => {
  const isPositive = type === 'positive';
  const color = isPositive ? '#00a878' : '#e8365d';
  const bgColor = isPositive ? 'rgba(0,168,120,0.07)' : 'rgba(232,54,93,0.07)';

  const maxVal = Math.max(...words.map(w => w.value || 1), 1);
  
  const getFontSize = (val) => {
    const ratio = val / maxVal;
    return Math.round(12 + ratio * 18); // Range: 12-30
  };
  
  const getOpacity = (val) => {
    const ratio = val / maxVal;
    return 0.6 + ratio * 0.4; // Range: 0.6-1.0
  };

  const getWeight = (val) => {
    const ratio = val / maxVal;
    return ratio > 0.7 ? '900' : ratio > 0.4 ? '700' : '600';
  };

  return (
    <View style={{ 
      flex: 1, 
      borderRadius: 16, 
      padding: 16, 
      backgroundColor: '#fff',
      shadowColor: 'rgba(110,34,110,0.06)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 2 
    }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
      }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a0a1a' }}>{title}</Text>
        <View style={{ 
          paddingHorizontal: 10, 
          paddingVertical: 4, 
          borderRadius: 12, 
          backgroundColor: bgColor 
        }}>
          <Text style={{ fontSize: 12, fontWeight: '800', color }}>{percentage}%</Text>
        </View>
      </View>

      {/* Word Cloud Area */}
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 1,
        paddingVertical: 8,
        minHeight: 120,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {words.map((word, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => onWordPress?.(word)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: 'transparent',
            }}
          >
            <Text
              style={{
                fontWeight: getWeight(word.value || 1),
                fontSize: getFontSize(word.value || 1),
                color: color,
                opacity: getOpacity(word.value || 1),
                textAlign: 'center',
              }}
            >
              {word.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export const DonutLegend = ({ title, centerValue, centerLabel, items }) => (
  <View className="bg-white flex-row items-center" style={{ borderRadius: 16, padding: 16, marginBottom: 10, shadowColor: 'rgba(110,34,110,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2, gap: 14 }}>
    <View style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 8, borderColor: items[0]?.color || '#6e226e', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a0a1a' }}>{centerValue}</Text>
      <Text style={{ fontSize: 10, color: '#9e859e' }}>{centerLabel}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a0a1a', marginBottom: 8 }}>{title}</Text>
      {items.map((item, i) => (
        <View key={i} className="flex-row items-center justify-between" style={{ marginBottom: 6 }}>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color }} />
            <Text style={{ fontSize: 12, color: '#1a0a1a' }}>{item.name}</Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#1a0a1a' }}>{item.value}</Text>
        </View>
      ))}
    </View>
  </View>
);

export const HashtagCloud = ({ hashtags = [], onHashtagPress }) => {
  const sizes = [18, 13, 15, 11, 16, 12, 14, 13, 11, 15, 12, 11, 10, 13, 10, 12, 14, 11];
  
  // Don't render if no hashtags
  if (!hashtags || hashtags.length === 0) {
    return (
      <View 
        className="bg-white" 
        style={{ 
          borderRadius: 16, 
          padding: 16, 
          marginBottom: 10, 
          shadowColor: 'rgba(110,34,110,0.06)', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 1, 
          shadowRadius: 10, 
          elevation: 2,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 80,
        }}
      >
        <Text style={{ color: '#9e859e', fontSize: 12 }}>No hashtags found</Text>
      </View>
    );
  }
  
  return (
    <View 
      className="bg-white" 
      style={{ 
        borderRadius: 16, 
        padding: 16, 
        marginBottom: 10, 
        shadowColor: 'rgba(110,34,110,0.06)', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 1, 
        shadowRadius: 10, 
        elevation: 2 
      }}
    >
      <View className="flex-row flex-wrap" style={{ gap: 4 }}>
        {hashtags.map((tag, i) => {
          // Handle both object format {id, name, platformContents} and string format
          const tagName = typeof tag === 'string' ? tag : (tag.name || tag);
          const tagId = typeof tag === 'string' ? i : (tag.id || i);
          const hasLink = typeof tag === 'object' && tag.platformContents && tag.platformContents.length > 0;
          
          return (
            <TouchableOpacity
              key={tagId}
              onPress={() => {
                if (onHashtagPress) {
                  onHashtagPress(tag);
                } else if (hasLink) {
                  // Default behavior: open first permalink
                  const permalink = tag.platformContents[0].permalink;
                  if (permalink) {
                    Linking.openURL(permalink).catch(err => console.error('Failed to open URL:', err));
                  }
                }
              }}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                backgroundColor: hasLink ? 'rgba(0,168,120,0.12)' : 'rgba(0,168,120,0.08)',
                marginRight: 6,
                marginBottom: 6,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text 
                style={{ 
                  fontWeight: '700', 
                  fontSize: sizes[i % sizes.length], 
                  color: '#00a878', 
                  lineHeight: sizes[i % sizes.length] * 1.4 
                }}
              >
                {tagName}
              </Text>
              {hasLink && (
                <Text style={{ marginLeft: 4, fontSize: 10, color: '#00a878' }}>↗</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const SectionTitle = ({ children, badge, badgeBg, badgeColor }) => (
  <View className="flex-row items-center justify-between" style={{ marginBottom: 12, marginTop: 20 }}>
    <Text style={{ fontSize: 14, fontWeight: '800', color: '#1a0a1a', letterSpacing: -0.2 }}>{children}</Text>
    {badge && (
      <View style={{ backgroundColor: badgeBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
        <Text style={{ fontSize: 10, fontWeight: '700', color: badgeColor, letterSpacing: 0.3 }}>{badge}</Text>
      </View>
    )}
  </View>
);

export const SimpleBarChart = ({ title, data, isSmallDevice }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const safeData = data || [];
  if (safeData.length === 0) return null;

  const maxVal = Math.max(...safeData.map(d => d.value), 1);

  const handlePress = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View className="bg-white" style={{ borderRadius: 16, padding: isSmallDevice ? 12 : 16, marginBottom: 10, shadowColor: 'rgba(110,34,110,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2 }}>
      {title && <Text style={{ fontSize: isSmallDevice ? 11 : 13, fontWeight: '800', color: '#1a0a1a', marginBottom: 12 }}>{title}</Text>}

      {/* Interactive Tooltip Display */}
      {activeIndex !== null && (
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#f3e6f3', 
          paddingVertical: 6, 
          paddingHorizontal: 12, 
          borderRadius: 8, 
          marginBottom: 8,
          borderWidth: 1, 
          borderColor: '#ede4ed' 
        }}>
           <Text style={{ fontSize: 12, fontWeight: '600', color: '#6e226e' }}>
             {safeData[activeIndex].label}
           </Text>
           <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#6e226e', marginHorizontal: 8 }} />
           <Text style={{ fontSize: 14, fontWeight: '800', color: '#1a0a1a' }}>
             {safeData[activeIndex].value}
           </Text>
        </View>
      )}

      <View className="flex-row items-end justify-between" style={{ height: isSmallDevice ? 100 : 130 }}>
        {safeData.map((d, i) => (
          <TouchableOpacity 
            key={i} 
            activeOpacity={0.8} 
            onPress={() => handlePress(i)} 
            style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}
          >
            <View
              style={{
                width: '60%',
                height: `${(d.value / maxVal) * 100}%`,
                backgroundColor: activeIndex === i ? '#9b3d9b' : '#6e226e', // Lighter purple for active
                borderRadius: 4,
                minHeight: 4,
                borderWidth: activeIndex === i ? 1.5 : 0,
                borderColor: '#fff',
                marginBottom: activeIndex === i ? 2 : 0,
              }}
            />
            {/* Static label removed */}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export const IntentCard = ({ title, items, isSmallDevice }) => (
  <View className="bg-white" style={{ borderRadius: 16, padding: isSmallDevice ? 12 : 14, shadowColor: 'rgba(110,34,110,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2 }}>
    <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a0a1a', marginBottom: 10 }}>{title}</Text>
    {items.map((item, i) => (
      <View key={i} style={{ marginBottom: 8 }}>
        <View className="flex-row items-center justify-between" style={{ marginBottom: 4 }}>
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
            <Text style={{ fontSize: 10, color: '#9e859e' }}>{item.name}</Text>
          </View>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#1a0a1a' }}>{item.value}%</Text>
        </View>
        <View style={{ height: 6, backgroundColor: '#ede4ed', borderRadius: 3, overflow: 'hidden' }}>
          <View style={{ width: `${item.value}%`, height: '100%', backgroundColor: item.color, borderRadius: 3 }} />
        </View>
      </View>
    ))}
  </View>
);