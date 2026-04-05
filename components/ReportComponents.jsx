// components/ReportComponents
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

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

export const SentimentWordCloud = ({ title, percentage, words, type }) => {
  const isPositive = type === 'positive';
  const color = isPositive ? '#00a878' : '#e8365d';
  const sizes = [15, 11, 13, 10, 14, 11, 12, 10, 13, 11];

  return (
    <View className="bg-white" style={{ flex: 1, borderRadius: 16, padding: 14, shadowColor: 'rgba(110,34,110,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2 }}>
      <View className="flex-row justify-between items-center" style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: '800', color: '#1a0a1a' }}>{title}</Text>
        <Text style={{ fontSize: 13, fontWeight: '800', color }}>{percentage}%</Text>
      </View>
      <View className="flex-row flex-wrap" style={{ gap: 4 }}>
        {words.map((word, i) => (
          <Text key={i} style={{ fontWeight: '600', fontSize: sizes[i % sizes.length], color, marginRight: 5 }}>{word}</Text>
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

export const HashtagCloud = ({ hashtags }) => {
  const sizes = [18, 13, 15, 11, 16, 12, 14, 13, 11, 15, 12, 11, 10, 13, 10, 12, 14, 11];
  return (
    <View className="bg-white" style={{ borderRadius: 16, padding: 16, marginBottom: 10, shadowColor: 'rgba(110,34,110,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2 }}>
      <View className="flex-row flex-wrap" style={{ gap: 4 }}>
        {hashtags.map((tag, i) => (
          <Text key={i} style={{ fontWeight: '700', fontSize: sizes[i % sizes.length], color: '#00a878', marginRight: 6, lineHeight: sizes[i % sizes.length] * 2 }}>{tag}</Text>
        ))}
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
  const maxVal = Math.max(...data.map(d => d.value));
  return (
    <View className="bg-white" style={{ borderRadius: 16, padding: isSmallDevice ? 12 : 16, marginBottom: 10, shadowColor: 'rgba(110,34,110,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2 }}>
      {title && <Text style={{ fontSize: isSmallDevice ? 11 : 13, fontWeight: '800', color: '#1a0a1a', marginBottom: 12 }}>{title}</Text>}
      <View className="flex-row items-end justify-between" style={{ height: isSmallDevice ? 100 : 130 }}>
        {data.map((d, i) => (
          <View key={i} className="items-center" style={{ flex: 1 }}>
            <View
              style={{
                width: '60%',
                height: `${(d.value / maxVal) * 100}%`,
                backgroundColor: '#6e226e',
                borderRadius: 4,
                minHeight: 4,
              }}
            />
            <Text style={{ fontSize: 7, color: '#9e859e', marginTop: 4, textAlign: 'center' }}>{d.label}</Text>
          </View>
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