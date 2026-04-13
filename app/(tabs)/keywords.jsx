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
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';
import { fetchKeywords, deleteKeyword, refetchKeyword } from '../../api/keywordApi';
import { fetchHomeData } from '../../api/homeApi';
import { useFocusEffect } from 'expo-router';

const { width, height } = Dimensions.get('window');
const PAGE_SIZE = 20;

const formatShowForUI = (show) => {
  const platforms = [];
  const autoFetch = show.autoFetch || {};
  if (autoFetch.twitter)   platforms.push('Twitter');
  if (autoFetch.facebook)  platforms.push('Facebook');
  if (autoFetch.instagram) platforms.push('Instagram');
  if (autoFetch.youtube)   platforms.push('YouTube');
  if (autoFetch.tiktok)    platforms.push('TikTok');
  if (autoFetch.linkedin)  platforms.push('LinkedIn');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const startDate = formatDate(show.start_date);
  const endDate = show.end_date
    ? new Date(show.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';
  const dateRange = startDate && endDate ? `${startDate} – ${endDate}` : 'No date set';

  return {
    id:        show.id,
    name:      show.name,
    platforms: platforms.length > 0 ? platforms : ['All Platforms'],
    dateRange,
    status:    show.status?.toLowerCase() || 'pending',
    mentions:  show.mentions || '0',
    hash:      show.hash?.hash,
  };
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = ({ size = 14, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={12} y1={5} x2={12} y2={19} /><Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);
const SearchIcon = ({ size = 16, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={11} cy={11} r={8} /><Line x1={21} y1={21} x2={16.65} y2={16.65} />
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
    <Line x1={18} y1={20} x2={18} y2={10} /><Line x1={12} y1={20} x2={12} y2={4} /><Line x1={6} y1={20} x2={6} y2={14} />
  </Svg>
);
const CalendarIcon = ({ size = 11, color = '#9e859e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Rect x={3} y={4} width={18} height={18} rx={2} />
    <Line x1={16} y1={2} x2={16} y2={6} /><Line x1={8} y1={2} x2={8} y2={6} /><Line x1={3} y1={10} x2={21} y2={10} />
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
    <Line x1={16} y1={13} x2={8} y2={13} /><Line x1={16} y1={17} x2={8} y2={17} />
  </Svg>
);
const RefreshIcon = ({ size = 13, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
    <Polyline points="23 4 23 10 17 10" /><Path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </Svg>
);
const DeleteIcon = ({ size = 15, color = '#e8365d' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <Path d="M10 11v6" /><Path d="M14 11v6" /><Path d="M9 6V4h6v2" />
  </Svg>
);
const LogoIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
  </Svg>
);

// ── CARD ──────────────────────────────────────────────────────────────────────
const KeywordCard = ({ keyword, isSmallDevice, onEdit, onUpdate, onDelete, isUpdating, isDeleting }) => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'live':     return { bg: '#e6f9f4', color: '#00a878' };
      case 'updating': return { bg: '#fff7e0', color: '#d48a00' };
      case 'done':     return { bg: '#f0f0f0', color: '#777' };
      case 'pending':  return { bg: '#fff0f3', color: '#e8365d' };
      default:         return { bg: '#f0f0f0', color: '#777' };
    }
  };

  const statusStyle     = getStatusStyle(keyword.status);
  const cardPadding     = isSmallDevice ? 12 : 16;
  const nameSize        = isSmallDevice ? 14 : 15;
  const actionBtnHeight = isSmallDevice ? 32 : 36;

  return (
    <View
      className="bg-white mb-3 overflow-hidden"
      style={{ borderRadius: 18, shadowColor: 'rgba(110,34,110,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 3 }}
    >
      <TouchableOpacity
      onPress={() => router.push(`/pages/report/${keyword.hash}`)}
      >
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
          <Text style={{ fontSize: 10, fontWeight: '700', color: statusStyle.color, letterSpacing: 0.4 }}>
            {keyword.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center border-t border-border" style={{ padding: isSmallDevice ? 8 : 10, paddingHorizontal: 12, gap: 7 }}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => onEdit(keyword.id)}
          className="flex-1 flex-row items-center justify-center bg-dark"
          style={{ height: actionBtnHeight, borderRadius: 10, gap: 4 }}
        >
          <EditIcon />
          <Text className="text-white font-bold" style={{ fontSize: 12 }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/pages/report/${keyword.hash}`)}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center bg-primary"
          style={{ height: actionBtnHeight, borderRadius: 10, gap: 4 }}
        >
          <ReportIcon />
          <Text className="text-white font-bold" style={{ fontSize: 12 }}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onUpdate(keyword.id)}
          disabled={isUpdating}
          activeOpacity={0.75}
          className="flex-1 flex-row items-center justify-center bg-primary-xlight"
          style={{ height: actionBtnHeight, borderRadius: 10, gap: 4 }}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#6e226e" />
          ) : (
            <>
              <RefreshIcon />
              <Text className="text-primary font-bold" style={{ fontSize: 12 }}>Update</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(keyword.id)}
          disabled={isDeleting}
          activeOpacity={0.75}
          className="items-center justify-center"
          style={{ width: actionBtnHeight, height: actionBtnHeight, borderRadius: 10, backgroundColor: '#fff0f3' }}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#e8365d" />
          ) : (
            <DeleteIcon />
          )}
        </TouchableOpacity>
      </View>
      </TouchableOpacity>
    </View>
  );
};

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────
export default function KeywordsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery]     = useState('');
  const [keywords, setKeywords]           = useState([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError]                 = useState('');
  const [refreshing, setRefreshing]       = useState(false);
  const [page, setPage]                   = useState(1);
  const [hasMore, setHasMore]             = useState(true);
  const [actionLoading, setActionLoading] = useState({ id: null, type: null });
  const [totalItems, setTotalItems] = useState(null);

  const isSmallDevice   = height < 700;
  const headerTitleSize = isSmallDevice ? 12 : 16;
  const searchHeight    = isSmallDevice ? 40 : 44;
  const logoIconSize    = isSmallDevice ? 32 : 36;

  const loadKeywords = useCallback(async () => {
  setIsLoading(true);
  setError('');

  // Fetch both list and total count in parallel
  const [listResult, homeData] = await Promise.allSettled([
    fetchKeywords(1, PAGE_SIZE, searchQuery),
    fetchHomeData({ perPage: 1 }),  // perPage:1 is enough, we only need pageInfo
  ]);

  if (listResult.status === 'fulfilled' && listResult.value.success) {
    setKeywords(listResult.value.data.shows.map(formatShowForUI));
    setHasMore(listResult.value.hasMore ?? false);
    setPage(1);
  } else {
    setError(listResult.value?.message || 'Failed to load keywords');
  }

  if (homeData.status === 'fulfilled') {
    setTotalItems(homeData.value.keywordPageInfo.totalItems);
  }

  setIsLoading(false);
}, [searchQuery]);

  useFocusEffect(
  useCallback(() => {
    loadKeywords();
  }, [loadKeywords])
);

  // ── Load next page ────────────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const result = await fetchKeywords(nextPage, PAGE_SIZE, searchQuery);
    if (result.success) {
      setKeywords((prev) => [...prev, ...result.data.shows.map(formatShowForUI)]);
      setHasMore(result.hasMore ?? false);
      setPage(nextPage);
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, isLoading, page, searchQuery]);

  // ── Pull-to-refresh ───────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await fetchKeywords(1, PAGE_SIZE, searchQuery);
    if (result.success) {
      setKeywords(result.data.shows.map(formatShowForUI));
      setHasMore(result.hasMore ?? false);
      setPage(1);
    }
    setRefreshing(false);
  }, [searchQuery]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    Alert.alert('Delete Keyword', 'Are you sure you want to delete this keyword?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setActionLoading({ id, type: 'delete' });
          const result = await deleteKeyword(id);
          setActionLoading({ id: null, type: null });
          if (result.success) {
            Alert.alert('Success', result.message || 'Keyword deleted successfully');
            loadKeywords();
          } else {
            Alert.alert('Error', result.message || 'Failed to delete keyword');
          }
        },
      },
    ]);
  };

  const handleUpdate = async (id) => {
    setActionLoading({ id, type: 'update' });
    const result = await refetchKeyword(id);
    setActionLoading({ id: null, type: null });
    if (result.success) {
      Alert.alert('Success', result.message || 'Update started');
      loadKeywords();
    } else {
      Alert.alert('Error', result.message || 'Failed to update keyword');
    }
  };

  const handleEditKeyword = (id) => router.push(`/pages/details/${id}`);

  const filteredKeywords = keywords.filter((kw) =>
    kw.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Scroll handler ────────────────────────────────────────────────────────
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const nearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
    if (nearBottom) loadMore();
  };

  return (
    <View className="flex-1 bg-surface2">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Header ── */}
      <View
        className="bg-primary overflow-hidden"
        style={{ paddingTop: insets.top || StatusBar.currentHeight || 0, paddingBottom: isSmallDevice ? 20 : 24, paddingHorizontal: width * 0.06 }}
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
          <TouchableOpacity onPress={() => router.push('/pages/compare/')} activeOpacity={0.8} className="items-center justify-center" style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12 }}>
            <CompareIcon size={18} />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => router.push('/pages/alerts/')} activeOpacity={0.8} className="items-center justify-center" style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12 }}>
            <BellDotIcon size={18} />
          </TouchableOpacity> */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/pages/create-keyword')}
            className="flex-row items-center bg-white"
            style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, gap: 5 }}
          >
            <PlusIcon />
            <Text className="text-primary font-bold" style={{ fontSize: 13 }}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Search ── */}
      <View className="flex-row" style={{ paddingHorizontal: width * 0.05, paddingTop: 16, paddingBottom: 12, gap: 10 }}>
        <View className="flex-1 flex-row items-center bg-white border border-border" style={{ height: searchHeight, borderRadius: 14, paddingHorizontal: 14, gap: 8 }}>
          <SearchIcon />
          <TextInput
            className="flex-1 text-dark"
            style={{ fontSize: 13.5 }}
            placeholder="Search by name..."
            placeholderTextColor="#c8b2c8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* ── Count ── */}
      <View style={{ paddingHorizontal: width * 0.05, paddingBottom: 10 }}>
        <Text className="text-muted" style={{ fontSize: 12.5 }}>
          <Text className="text-primary font-bold">
            {isLoading ? '...' : (searchQuery ? filteredKeywords.length : (totalItems ?? filteredKeywords.length))}
          </Text> keywords found
        </Text>
      </View>

      {/* ── List ── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: width * 0.05, paddingBottom: 20, flexGrow: isLoading ? 1 : 0 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6e226e']} tintColor="#6e226e" />
        }
      >
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#6e226e" />
            <Text style={{ marginTop: 12, color: '#9e859e', fontSize: 13 }}>Loading keywords...</Text>
          </View>
        ) : error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#e8365d', fontSize: 14, textAlign: 'center', marginBottom: 12 }}>{error}</Text>
            <TouchableOpacity onPress={loadKeywords} style={{ backgroundColor: '#6e226e', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredKeywords.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#9e859e', fontSize: 14 }}>No keywords found</Text>
          </View>
        ) : (
          <>
            {filteredKeywords.map((keyword) => (
              <KeywordCard
                key={keyword.id}
                keyword={keyword}
                isSmallDevice={isSmallDevice}
                onEdit={handleEditKeyword}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                isUpdating={actionLoading.id === keyword.id && actionLoading.type === 'update'}
                isDeleting={actionLoading.id === keyword.id && actionLoading.type === 'delete'}
              />
            ))}

            {/* ── Footer ── */}
            {isLoadingMore && (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#6e226e" />
                <Text style={{ marginTop: 6, color: '#9e859e', fontSize: 12 }}>Loading more...</Text>
              </View>
            )}
            {!hasMore && filteredKeywords.length > 0 && (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <Text style={{ color: '#c8b2c8', fontSize: 12 }}>All keywords loaded</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}