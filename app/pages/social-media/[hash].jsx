import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  FlatList,
  Linking,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BackIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const HeartIcon = ({ size = 16, color = '#e8365d' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={2}>
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const CommentIcon = ({ size = 16, color = '#3b82f6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

const ShareIcon = ({ size = 16, color = '#00a878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
  </Svg>
);

const EyeIcon = ({ size = 16, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </Svg>
);

const ExternalLinkIcon = ({ size = 14, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </Svg>
);

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  const n = Number(num);
  if (isNaN(n)) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getPlatformColor = (platform) => {
  const colors = {
    facebook: '#1877f2',
    instagram: '#e1306c',
    twitter: '#1da1f2',
    tiktok: '#000000',
    youtube: '#ff0000',
    linkedin: '#0077b5',
  };
  return colors[platform?.toLowerCase()] || '#6e226e';
};

const getSentimentColor = (sentiment) => {
  if (sentiment === 'positive') return '#00a878';
  if (sentiment === 'negative') return '#e8365d';
  return '#f59e0b';
};

const ContentCard = ({ item }) => {
  const platformColor = getPlatformColor(item.platform);
  const sentimentColor = getSentimentColor(item.sentiment);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: 'rgba(110,34,110,0.08)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {item.thumbnail && (
        <View style={{ height: 180, backgroundColor: '#f1f5f9' }}>
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: 'rgba(0,0,0,0.7)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase' }}>
              {item.type || 'Post'}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: platformColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'capitalize' }}>
              {item.platform}
            </Text>
          </View>
        </View>
      )}

      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: platformColor,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
              {item.author_name?.charAt(0) || '?'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a0a1a' }} numberOfLines={1}>
              {item.author_name || 'Unknown Author'}
            </Text>
            <Text style={{ fontSize: 11, color: '#9e859e' }}>
              {formatDate(item.publishedAt)}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: `${sentimentColor}15`,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '700', color: sentimentColor, textTransform: 'capitalize' }}>
              {item.sentiment || 'Neutral'}
            </Text>
          </View>
        </View>

        {item.text && (
          <Text
            style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 20, marginBottom: 12 }}
            numberOfLines={3}
          >
            {item.text}
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <HeartIcon size={14} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#1a0a1a' }}>
              {formatNumber(item.likes)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <CommentIcon size={14} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#1a0a1a' }}>
              {formatNumber(item.comments_count)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ShareIcon size={14} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#1a0a1a' }}>
              {formatNumber(item.shares)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <EyeIcon size={14} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#1a0a1a' }}>
              {formatNumber(item.views || item.reach)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => item.permalink && Linking.openURL(item.permalink)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3e6f3',
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 12,
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#6e226e' }}>View Post</Text>
          <ExternalLinkIcon size={14} color="#6e226e" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function SocialMediaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hash, name } = useLocalSearchParams();

  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortColumn, setSortColumn] = useState('reach');
  const [sortDir, setSortDir] = useState('desc');

  const fetchContent = async (pageNum = 1, refresh = false) => {
    try {
      if (pageNum === 1) {
        refresh ? setRefreshing(true) : setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError('');

      const token = await AsyncStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const url = `${BASE_URL}/items/${hash}?page=${pageNum}&perPage=10&hash=${hash}&sort_column=${sortColumn}&sort_dir=${sortDir}`;
      const response = await fetch(url, { headers });
      const data = await response.json();

      if (data.success !== false) {
        if (pageNum === 1) {
          setContent(data.content || []);
        } else {
          setContent((prev) => [...prev, ...(data.content || [])]);
        }
        setTotalPages(data.pageInfo?.totalPages || 1);
        setTotalItems(data.pageInfo?.totalItems || 0);
        setPage(pageNum);
      } else {
        setError(data.message || 'Failed to load content');
      }
    } catch (err) {
      setError(err.message || 'Failed to load content');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (hash) fetchContent(1);
  }, [hash, sortColumn, sortDir]);

  const handleRefresh = () => fetchContent(1, true);

  const handleLoadMore = () => {
    if (!isLoadingMore && page < totalPages) {
      fetchContent(page + 1);
    }
  };

  const SortButton = ({ label, value }) => (
    <TouchableOpacity
      onPress={() => {
        if (sortColumn === value) {
          setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
        } else {
          setSortColumn(value);
          setSortDir('desc');
        }
      }}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: sortColumn === value ? '#6e226e' : '#f3e6f3',
        marginRight: 8,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: sortColumn === value ? '#fff' : '#6e226e',
        }}
      >
        {label} {sortColumn === value ? (sortDir === 'desc' ? '↓' : '↑') : ''}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#faf8fa', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#6e226e" />
        <Text style={{ marginTop: 12, color: '#9e859e' }}>Loading content...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#faf8fa' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View
        style={{
          backgroundColor: '#6e226e',
          paddingTop: insets.top || StatusBar.currentHeight || 0,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BackIcon size={18} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }} numberOfLines={1}>
              Social Media
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              {totalItems} posts found
            </Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ede4ed' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SortButton label="Reach" value="reach" />
          <SortButton label="Likes" value="likes" />
          <SortButton label="Comments" value="comments_count" />
          <SortButton label="Shares" value="shares" />
          <SortButton label="Views" value="views" />
          <SortButton label="Date" value="publishedAt" />
        </ScrollView>
      </View>

      {error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: '#e8365d', fontSize: 14, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchContent(1)}
            style={{ marginTop: 16, backgroundColor: '#6e226e', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={content}
          keyExtractor={(item, index) => `${item.id || index}`}
          renderItem={({ item }) => <ContentCard item={item} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#6e226e']} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#6e226e" />
              </View>
            ) : page < totalPages ? (
              <TouchableOpacity
                onPress={handleLoadMore}
                style={{
                  backgroundColor: '#f3e6f3',
                  padding: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                <Text style={{ color: '#6e226e', fontWeight: '700' }}>Load More</Text>
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: '#9e859e', fontSize: 14 }}>No content found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}