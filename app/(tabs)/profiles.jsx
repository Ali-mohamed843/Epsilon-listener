import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

const PLATFORM_TABS = [
  { label: 'Facebook',  type: 'facebook-profile' },
  { label: 'Instagram', type: 'instagram-profile' },
  { label: 'Twitter',   type: 'twitter-profile' },
  { label: 'LinkedIn',  type: 'linkedin-profile' },
  { label: 'TikTok',    type: 'tiktok-profile' },
  { label: 'YouTube',   type: 'youtube-profile' },
  { label: 'Snapchat',  type: 'snapchat-profile' },
];

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const fetchByType = async (type, page, perPage, search) => {
  const headers = await getHeaders();
  const res = await fetch(
    `${BASE_URL}/shows?page=${page}&perPage=${perPage}&search=${encodeURIComponent(search)}&type=${type}`,
    { method: 'GET', headers }
  );
  const data = await res.json();
  return data.success && data.shows ? data.shows : [];
};

const fetchProfiles = async (selectedType, page = 1, perPage = 50, search = '') => {
  try {
    const shows = await fetchByType(selectedType, page, perPage, search);
    return { success: true, data: shows };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── helpers ───────────────────────────────────────────────────────────────────

const formatFollowers = (num) => {
  if (!num || num === 0) return '0';
  const n = Number(num);
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
};

const formatDateRange = (start, end) => {
  if (!start && !end) return 'No date set';
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  return `${fmt(start)} — ${fmt(end)}`;
};

const formatPlatformType = (type) => {
  if (!type) return 'Unknown';
  return type
    .replace('-profile', '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

// ── icons ─────────────────────────────────────────────────────────────────────

const PlusIcon = ({ size = 14, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={12} y1={5} x2={12} y2={19} />
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);

const CompareIcon = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={18} y1={20} x2={18} y2={10} />
    <Line x1={12} y1={20} x2={12} y2={4} />
    <Line x1={6} y1={20} x2={6} y2={14} />
  </Svg>
);

const SearchIcon = ({ size = 16, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={11} cy={11} r={8} />
    <Line x1={21} y1={21} x2={16.65} y2={16.65} />
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
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
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

const BellDotIcon = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    <Circle cx={18} cy={4} r={3} fill="#e8365d" stroke="#e8365d" />
  </Svg>
);

const DeleteIcon = ({ size = 15, color = '#e8365d' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </Svg>
);

const LogoIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  </Svg>
);

// ── platform badge icons ───────────────────────────────────────────────────────

const FacebookBadge = ({ size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1877f2">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

const InstagramBadge = ({ size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#e1306c">
    <Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
  </Svg>
);

const TwitterBadge = ({ size = 10 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1da1f2">
    <Path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
  </Svg>
);

const platformStyles = {
  Facebook:  { bg: '#e8f0ff', color: '#1877f2', gradient: '#1877f2', Badge: FacebookBadge },
  Instagram: { bg: '#fff0f5', color: '#e1306c', gradient: '#e1306c', Badge: InstagramBadge },
  Twitter:   { bg: '#e8f6ff', color: '#1da1f2', gradient: '#1da1f2', Badge: TwitterBadge },
  Linkedin:  { bg: '#e8f0ff', color: '#0a66c2', gradient: '#0a66c2', Badge: FacebookBadge },
  Tiktok:    { bg: '#f0f0f0', color: '#555',    gradient: '#010101', Badge: TwitterBadge },
  Youtube:   { bg: '#fff0f0', color: '#cc0000', gradient: '#ff0000', Badge: TwitterBadge },
  Snapchat:  { bg: '#fffde8', color: '#ccaa00', gradient: '#ffcc00', Badge: TwitterBadge },
};

// ── tab bar ───────────────────────────────────────────────────────────────────

const PlatformTabBar = ({ selectedTab, onSelect }) => (
  <View style={{ height: 42 }}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: width * 0.05,
        gap: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
      }}
    >
      {PLATFORM_TABS.map((tab) => {
        const active = selectedTab === tab.type;
        return (
          <TouchableOpacity
            key={tab.label}
            onPress={() => onSelect(tab.type)}
            activeOpacity={0.75}
            style={{
              height: 34,
              paddingHorizontal: 16,
              borderRadius: 17,
              backgroundColor: active ? '#6e226e' : '#fff',
              borderWidth: 1.5,
              borderColor: active ? '#6e226e' : '#ede4ed',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{
              fontSize: 13,
              fontWeight: active ? '700' : '500',
              color: active ? '#fff' : '#9e859e',
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

// ── profile card ──────────────────────────────────────────────────────────────

const ProfileCard = ({ profile, isSmallDevice, onEdit, onReport }) => {
  const [isChecked, setIsChecked] = useState(false);
  const style = platformStyles[profile.platform] || platformStyles.Facebook;
  const BadgeIcon = style.Badge;

  const avatarSize  = isSmallDevice ? 40 : 46;
  const nameSize    = isSmallDevice ? 13.5 : 14.5;
  const actionBtnH  = isSmallDevice ? 32 : 36;
  const cardPadding = isSmallDevice ? 12 : 14;

  return (
    <View
      className="bg-white mb-3 overflow-hidden"
      style={{
        borderRadius: 18,
        shadowColor: 'rgba(110,34,110,0.06)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center" style={{ padding: cardPadding, paddingBottom: cardPadding - 2, gap: 12 }}>
        {/* checkbox */}
        <TouchableOpacity
          onPress={() => setIsChecked(!isChecked)}
          style={{
            width: 20,
            height: 20,
            borderWidth: 2,
            borderColor: isChecked ? '#6e226e' : '#ede4ed',
            borderRadius: 6,
            backgroundColor: isChecked ? '#6e226e' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isChecked && (
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <Polyline points="20 6 9 17 4 12" />
            </Svg>
          )}
        </TouchableOpacity>

        {/* avatar */}
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: 14,
            backgroundColor: style.gradient,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Text className="text-white font-extrabold" style={{ fontSize: isSmallDevice ? 15 : 17 }}>
            {profile.name.charAt(0)}
          </Text>
          <View
            className="absolute bg-white items-center justify-center"
            style={{
              bottom: -4,
              right: -4,
              width: 18,
              height: 18,
              borderRadius: 9,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <BadgeIcon />
          </View>
        </View>

        {/* info */}
        <View className="flex-1" style={{ minWidth: 0 }}>
          <Text className="text-dark font-bold" style={{ fontSize: nameSize, marginBottom: 4 }} numberOfLines={1}>
            {profile.name}
          </Text>
          <View className="flex-row items-center flex-wrap" style={{ gap: 8 }}>
            <View style={{ backgroundColor: style.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 }}>
              <Text style={{ fontSize: 10.5, fontWeight: '600', color: style.color }}>{profile.platform}</Text>
            </View>
            <View className="flex-row items-center" style={{ gap: 4 }}>
              <CalendarIcon />
              <Text className="text-muted" style={{ fontSize: 11 }}>{profile.dateRange}</Text>
            </View>
          </View>
        </View>

        {/* followers */}
        <View className="bg-primary-xlight items-center" style={{ borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text className="text-primary font-extrabold" style={{ fontSize: 13, lineHeight: 13 }}>{profile.followers}</Text>
          <Text className="text-muted" style={{ fontSize: 10 }}>followers</Text>
        </View>
      </View>

      {/* action row */}
      <View className="flex-row items-center border-t border-border" style={{ padding: isSmallDevice ? 8 : 10, paddingHorizontal: 12, gap: 7 }}>
        <TouchableOpacity
          onPress={() => onEdit(profile.id)}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center bg-dark"
          style={{ height: actionBtnH, borderRadius: 10, gap: 4 }}
        >
          <EditIcon />
          <Text className="text-white font-bold" style={{ fontSize: 12 }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onReport(profile.id)}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center bg-primary"
          style={{ height: actionBtnH, borderRadius: 10, gap: 4 }}
        >
          <ReportIcon />
          <Text className="text-white font-bold" style={{ fontSize: 12 }}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center bg-primary-xlight"
          style={{ height: actionBtnH, borderRadius: 10, gap: 4 }}
        >
          <RefreshIcon />
          <Text className="text-primary font-bold" style={{ fontSize: 12 }}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          className="items-center justify-center"
          style={{ width: actionBtnH, height: actionBtnH, borderRadius: 10, backgroundColor: '#fff0f3' }}
        >
          <DeleteIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── screen ────────────────────────────────────────────────────────────────────

export default function ProfilesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('facebook-profile');
  const [profiles, setProfiles]       = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState('');

  const isSmallDevice   = height < 700;
  const headerTitleSize = isSmallDevice ? 14 : 18;
  const searchHeight    = isSmallDevice ? 40 : 44;
  const logoIconSize    = isSmallDevice ? 32 : 36;

  const loadProfiles = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const result = await fetchProfiles(selectedTab, 1, 50, searchQuery);
    if (result.success) {
      setProfiles(
        result.data.map((item) => ({
          id:        item.id,
          name:      item.name,
          platform:  formatPlatformType(item.type),
          dateRange: formatDateRange(item.start_date, item.end_date),
          followers: formatFollowers(item.followers),
        }))
      );
    } else {
      setError(result.message || 'Failed to load profiles');
    }
    setIsLoading(false);
  }, [selectedTab, searchQuery]);

  useEffect(() => { loadProfiles(); }, [loadProfiles]);

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabSelect = (type) => {
    setSelectedTab(type);
    setProfiles([]);
  };

  const handleEdit   = (id) => router.push(`/pages/edit-profile/${id}`);
  const handleReport = (id) => router.push(`/pages/report-profile/${id}`);

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── header ── */}
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
          <View
            className="items-center justify-center rounded-xl"
            style={{ width: logoIconSize, height: logoIconSize, backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <LogoIcon size={logoIconSize * 0.55} />
          </View>
          <View className="flex-1">
            <Text className="uppercase" style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, marginBottom: 2 }}>Monitoring</Text>
            <Text className="text-white font-extrabold" style={{ fontSize: headerTitleSize, letterSpacing: -0.4 }}>Profiles</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/pages/compare/')}
            activeOpacity={0.8}
            className="items-center justify-center"
            style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12 }}
          >
            <CompareIcon size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/pages/alerts/')}
            activeOpacity={0.8}
            className="items-center justify-center"
            style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12 }}
          >
            <BellDotIcon size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            className="flex-row items-center bg-white"
            style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, gap: 5 }}
          >
            <PlusIcon />
            <Text className="text-primary font-bold" style={{ fontSize: 13 }}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── search row ── */}
      <View className="flex-row" style={{ paddingHorizontal: width * 0.05, paddingTop: 16, paddingBottom: 6, gap: 10 }}>
        <View
          className="flex-1 flex-row items-center bg-white border border-border"
          style={{ height: searchHeight, borderRadius: 14, paddingHorizontal: 14, gap: 8 }}
        >
          <SearchIcon />
          <TextInput
            className="flex-1 text-dark"
            style={{ fontSize: 13.5 }}
            placeholder="Search profiles..."
            placeholderTextColor="#c8b2c8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          className="items-center justify-center bg-primary-xlight"
          style={{ width: searchHeight, height: searchHeight, borderRadius: 14 }}
        >
          <FilterIcon />
        </TouchableOpacity>
      </View>

      {/* ── platform tabs ── */}
      <PlatformTabBar selectedTab={selectedTab} onSelect={handleTabSelect} />

      {/* ── count row ── */}
      <View className="flex-row items-center justify-between" style={{ paddingHorizontal: width * 0.05, paddingTop: 4, paddingBottom: 8 }}>
        <Text className="text-muted" style={{ fontSize: 12.5 }}>
          <Text className="text-primary font-bold">{isLoading ? '…' : filteredProfiles.length}</Text> profiles found
        </Text>
        <TouchableOpacity>
          <Text className="text-primary font-medium" style={{ fontSize: 12.5 }}>Select all</Text>
        </TouchableOpacity>
      </View>

      {/* ── list ── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: width * 0.05, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6e226e" />
            <Text style={{ marginTop: 12, color: '#9e859e', fontSize: 13 }}>Loading profiles…</Text>
          </View>
        ) : error ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: '#e8365d', fontSize: 14, textAlign: 'center', marginBottom: 12 }}>{error}</Text>
            <TouchableOpacity
              onPress={loadProfiles}
              style={{ backgroundColor: '#6e226e', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredProfiles.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: '#9e859e', fontSize: 14 }}>No profiles found</Text>
          </View>
        ) : (
          filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              isSmallDevice={isSmallDevice}
              onEdit={handleEdit}
              onReport={handleReport}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}