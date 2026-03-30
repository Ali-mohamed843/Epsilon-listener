import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, router } from 'expo-router';
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const PlusIcon = ({ size = 14, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={12} y1={5} x2={12} y2={19} />
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);

const SearchIcon = ({ size = 16, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={11} cy={11} r={8} />
    <Line x1={21} y1={21} x2={16.65} y2={16.65} />
  </Svg>
);

const BellDotIcon = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <Circle cx={18} cy={4} r={3} fill="#e8365d" stroke="#e8365d" />
  </Svg>
);
const CompareIcon = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={18} y1={20} x2={18} y2={10} />
    <Line x1={12} y1={20} x2={12} y2={4} />
    <Line x1={6} y1={20} x2={6} y2={14} />
  </Svg>
);

const FilterIcon = ({ size = 18, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={4} y1={6} x2={20} y2={6} />
    <Line x1={8} y1={12} x2={16} y2={12} />
    <Line x1={11} y1={18} x2={13} y2={18} />
  </Svg>
);

const CalendarIcon = ({ size = 11, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Rect x={3} y={4} width={18} height={18} rx={2} />
    <Line x1={16} y1={2} x2={16} y2={6} />
    <Line x1={8} y1={2} x2={8} y2={6} />
    <Line x1={3} y1={10} x2={21} y2={10} />
  </Svg>
);

const EditIcon = ({ size = 13, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
);

const ReportIcon = ({ size = 13, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1={16} y1={13} x2={8} y2={13} />
    <Line x1={16} y1={17} x2={8} y2={17} />
  </Svg>
);

const RefreshIcon = ({ size = 13, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Polyline points="23 4 23 10 17 10" />
    <Path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </Svg>
);

const DeleteIcon = ({ size = 15, color = '#e8365d' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <Path d="M10 11v6" />
    <Path d="M14 11v6" />
    <Path d="M9 6V4h6v2" />
  </Svg>
);

const LogoIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  </Svg>
);

const KeywordCard = ({ keyword, isSmallDevice, onEdit }) => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'live': return { bg: '#e6f9f4', color: '#00a878' };
      case 'updating': return { bg: '#fff7e0', color: '#d48a00' };
      case 'done': return { bg: '#f0f0f0', color: '#777' };
      default: return { bg: '#f0f0f0', color: '#777' };
    }
  };

  const statusStyle = getStatusStyle(keyword.status);
  const cardPadding = isSmallDevice ? 12 : 16;
  const nameSize = isSmallDevice ? 14 : 15;
  const actionBtnHeight = isSmallDevice ? 32 : 36;

  return (
    <View className="bg-white mb-3 overflow-hidden" style={{ borderRadius: 18, shadowColor: 'rgba(110,34,110,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 3 }}>
      <View className="flex-row items-start" style={{ padding: cardPadding, paddingBottom: cardPadding - 4, gap: 12 }}>
        <TouchableOpacity
          onPress={() => setIsChecked(!isChecked)}
          style={{ width: 20, height: 20, borderWidth: 2, borderColor: isChecked ? '#6e226e' : '#ede4ed', borderRadius: 6, backgroundColor: isChecked ? '#6e226e' : 'transparent', marginTop: 2, alignItems: 'center', justifyContent: 'center' }}
        >
          {isChecked && (
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <Polyline points="20 6 9 17 4 12" />
            </Svg>
          )}
        </TouchableOpacity>

        <View className="flex-1" style={{ minWidth: 0 }}>
          <Text className="text-dark font-bold" style={{ fontSize: nameSize, marginBottom: 5 }} numberOfLines={1}>
            {keyword.name}
          </Text>
          <View className="flex-row flex-wrap items-center" style={{ gap: 8 }}>
            {keyword.platforms.map((platform, index) => (
              <View key={index} className="bg-primary-xlight" style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 }}>
                <Text className="text-primary" style={{ fontSize: 10.5, fontWeight: '600', letterSpacing: 0.3 }}>{platform}</Text>
              </View>
            ))}
            <View className="flex-row items-center" style={{ gap: 4 }}>
              <CalendarIcon />
              <Text className="text-muted" style={{ fontSize: 11 }}>{keyword.dateRange}</Text>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: statusStyle.bg, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: statusStyle.color, letterSpacing: 0.4 }}>{keyword.status.toUpperCase()}</Text>
        </View>
      </View>

      <View className="flex-row items-center border-t border-border" style={{ padding: isSmallDevice ? 8 : 10, paddingHorizontal: 12, gap: 7 }}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => onEdit(keyword.id)} className="flex-1 flex-row items-center justify-center bg-dark" style={{ height: actionBtnHeight, borderRadius: 10, gap: 4 }}>
          <EditIcon />
          <Text className="text-white font-bold" style={{ fontSize: 12 }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(`/pages/report/${keyword.id}`)} activeOpacity={0.75} className="flex-1 flex-row items-center justify-center bg-primary" style={{ height: actionBtnHeight, borderRadius: 10, gap: 4 }}>
          <ReportIcon />
          <Text className="text-white font-bold" style={{ fontSize: 12 }}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.75} className="flex-1 flex-row items-center justify-center bg-primary-xlight" style={{ height: actionBtnHeight, borderRadius: 10, gap: 4 }}>
          <RefreshIcon />
          <Text className="text-primary font-bold" style={{ fontSize: 12 }}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.75} className="items-center justify-center" style={{ width: actionBtnHeight, height: actionBtnHeight, borderRadius: 10, backgroundColor: '#fff0f3' }}>
          <DeleteIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function KeywordsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const isSmallDevice = height < 700;
  const headerTitleSize = isSmallDevice ? 12 : 16;
  const searchHeight = isSmallDevice ? 40 : 44;
  const logoIconSize = isSmallDevice ? 32 : 36;

  const keywords = [
    { id: 1, name: 'Climate Summit 2026', platforms: ['Twitter', 'Instagram'], dateRange: '01 Mar – 31 Mar 2026', status: 'live' },
    { id: 2, name: 'Tech Layoffs Wave', platforms: ['Twitter', 'LinkedIn'], dateRange: '15 Feb – 15 Mar 2026', status: 'updating' },
    { id: 3, name: 'Renewable Energy Egypt', platforms: ['Facebook', 'Youtube'], dateRange: '01 Jan – 28 Feb 2026', status: 'done' },
    { id: 4, name: 'Gaza Ceasefire Talks', platforms: ['Twitter', 'Tiktok', 'Snapchat'], dateRange: '10 Mar – 17 Mar 2026', status: 'live' },
  ];

  const filteredKeywords = keywords.filter((kw) =>
    kw.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditKeyword = (id) => {
    router.push(`/pages/details/${id}`);
  };

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View
        className="bg-primary overflow-hidden"
        style={{
          paddingTop: insets.top || StatusBar.currentHeight || 0,
          paddingBottom: isSmallDevice ? 20 : 24,
          paddingHorizontal: width * 0.06,
        }}
      >
        <View className="absolute rounded-full" style={{ top: -50, right: -50, width: 160, height: 160, backgroundColor: 'rgba(255,255,255,0.06)' }} />

        <View className="flex-row items-center" style={{ marginTop: 8, gap: 12 }}>
          <View className="items-center justify-center rounded-xl" style={{ width: logoIconSize, height: logoIconSize, backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <LogoIcon size={logoIconSize * 0.55} />
          </View>
          <View className="flex-1">
            <Text className="uppercase" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 2 }}>Monitoring</Text>
            <Text className="text-white font-extrabold" style={{ fontSize: headerTitleSize, letterSpacing: -0.4 }}>Keywords</Text>
          </View>
          <TouchableOpacity
            onPress={function() { router.push('/pages/compare/'); }}
            activeOpacity={0.8}
            className="items-center justify-center"
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderRadius: 12,
            }}
          >
            <CompareIcon size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={function() { router.push('/pages/alerts/'); }}
            activeOpacity={0.8}
            className="items-center justify-center"
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderRadius: 12,
            }}
          >
            <BellDotIcon size={18} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} className="flex-row items-center bg-white" style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, gap: 5 }}>
            <PlusIcon />
            <Text className="text-primary font-bold" style={{ fontSize: 13 }}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row" style={{ paddingHorizontal: width * 0.05, paddingTop: 16, paddingBottom: 12, gap: 10 }}>
        <View className="flex-1 flex-row items-center bg-white border border-border" style={{ height: searchHeight, borderRadius: 14, paddingHorizontal: 14, gap: 8 }}>
          <SearchIcon />
          <TextInput className="flex-1 text-dark" style={{ fontSize: 13.5 }} placeholder="Search by name..." placeholderTextColor="#c8b2c8" value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <TouchableOpacity className="items-center justify-center bg-primary-xlight" style={{ width: searchHeight, height: searchHeight, borderRadius: 14 }}>
          <FilterIcon />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between" style={{ paddingHorizontal: width * 0.05, paddingBottom: 10 }}>
        <Text className="text-muted" style={{ fontSize: 12.5 }}>
          <Text className="text-primary font-bold">{filteredKeywords.length}</Text> keywords found
        </Text>
        <TouchableOpacity>
          <Text className="text-primary font-medium" style={{ fontSize: 12.5 }}>Select all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: width * 0.05, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {filteredKeywords.map((keyword) => (
          <KeywordCard key={keyword.id} keyword={keyword} isSmallDevice={isSmallDevice} onEdit={handleEditKeyword} />
        ))}
      </ScrollView>
    </View>
  );
}