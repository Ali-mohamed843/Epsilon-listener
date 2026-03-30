import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

var TYPE_STYLES = {
  keyword: {
    bg: '#f3e6f3',
    color: '#6e226e',
    label: 'Keyword',
  },
  profile: {
    bg: '#e8f0ff',
    color: '#3b82f6',
    label: 'Profile',
  },
};

var CheckSvg = function() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6L9 17l-5-5" />
    </Svg>
  );
};

export default function CompareSelector({ item, isSelected, onToggle, disabled }) {
  var typeStyle = TYPE_STYLES[item.type] || TYPE_STYLES.keyword;

  return (
    <TouchableOpacity
      onPress={function() { onToggle(item); }}
      activeOpacity={0.7}
      disabled={disabled && !isSelected}
      style={{
        backgroundColor: isSelected ? '#faf5fa' : '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: isSelected ? '#6e226e' : '#ede4ed',
        padding: 14,
        marginBottom: 10,
        opacity: disabled && !isSelected ? 0.5 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: isSelected ? 'rgba(110,34,110,0.1)' : 'rgba(0,0,0,0.03)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: isSelected ? 3 : 1,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 7,
          borderWidth: 2,
          borderColor: isSelected ? '#6e226e' : '#ede4ed',
          backgroundColor: isSelected ? '#6e226e' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isSelected && <CheckSvg />}
      </View>

      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 13,
          backgroundColor: typeStyle.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '800', color: typeStyle.color }}>
          {item.name.charAt(0)}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 14, fontWeight: '700', color: '#1a0a1a', marginBottom: 3 }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              backgroundColor: typeStyle.bg,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 20,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '600', color: typeStyle.color }}>
              {typeStyle.label}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: '#9e859e' }}>{item.dateRange}</Text>
        </View>
      </View>

      {item.riskLevel && (
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 20,
            backgroundColor:
              item.riskLevel === 'High' ? '#fff0f3' :
              item.riskLevel === 'Medium' ? '#fffbeb' : '#f0fdf4',
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color:
                item.riskLevel === 'High' ? '#e8365d' :
                item.riskLevel === 'Medium' ? '#d97706' : '#047857',
            }}
          >
            {item.riskLevel}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}