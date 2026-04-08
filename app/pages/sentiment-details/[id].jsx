// app/pages/sentiment-details/[id].jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Linking,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// ============================================
// API CONFIGURATION
// ============================================

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// ============================================
// ICONS
// ============================================

const BackIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
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

const ExternalLinkIcon = ({ size = 14, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </Svg>
);

const FacebookIcon = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1877f2">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </Svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#e1306c">
    <Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
  </Svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1da1f2">
    <Path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
  </Svg>
);

const TiktokIcon = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#000">
    <Path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </Svg>
);

const YoutubeIcon = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#ff0000">
    <Path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </Svg>
);

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const getPlatformIcon = (platform) => {
  const icons = {
    facebook: <FacebookIcon />,
    instagram: <InstagramIcon />,
    twitter: <TwitterIcon />,
    tiktok: <TiktokIcon />,
    youtube: <YoutubeIcon />,
  };
  return icons[platform?.toLowerCase()] || <FacebookIcon />;
};

const getPlatformColor = (platform) => {
  const colors = {
    facebook: '#1877f2',
    instagram: '#e1306c',
    twitter: '#1da1f2',
    tiktok: '#000000',
    youtube: '#ff0000',
  };
  return colors[platform?.toLowerCase()] || '#6e226e';
};

const getSentimentConfig = (sentiment) => {
  if (sentiment === 'positive') {
    return { color: '#00a878', bg: '#e6f9f4', label: 'Positive', icon: '😊' };
  }
  if (sentiment === 'negative') {
    return { color: '#e8365d', bg: '#fff0f3', label: 'Negative', icon: '😟' };
  }
  return { color: '#f59e0b', bg: '#fffbeb', label: 'Neutral', icon: '😐' };
};

// ============================================
// COMMENT CARD COMPONENT
// ============================================

const CommentCard = ({ item }) => {
  const platformColor = getPlatformColor(item.platform);
  const sentimentConfig = getSentimentConfig(item.sentiment);

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
      {/* Platform Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: `${platformColor}08`,
          borderBottomWidth: 1,
          borderBottomColor: `${platformColor}15`,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: `${platformColor}15`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getPlatformIcon(item.platform)}
          </View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: platformColor,
              textTransform: 'capitalize',
            }}
          >
            {item.platform}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            backgroundColor: sentimentConfig.bg,
          }}
        >
          <Text style={{ fontSize: 10 }}>{sentimentConfig.icon}</Text>
          <Text style={{ fontSize: 10, fontWeight: '700', color: sentimentConfig.color }}>
            {sentimentConfig.label}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 14 }}>
        {/* Author Info */}
        {item.author_name && item.author_name !== 'NA' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: platformColor,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
                {item.author_name?.charAt(0) || '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1a0a1a' }} numberOfLines={1}>
                {item.author_name}
              </Text>
              <Text style={{ fontSize: 10, color: '#9e859e', marginTop: 1 }}>
                {formatDate(item.publishedAt)} • {formatTime(item.publishedAt)}
              </Text>
            </View>
          </View>
        )}

        {/* Comment Text */}
        {item.text && (
          <Text
            style={{ fontSize: 14, color: '#1a0a1a', lineHeight: 21, marginBottom: 12 }}
          >
            {item.text}
          </Text>
        )}

        {/* Keywords */}
        {item.keywords && item.keywords.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 12 }}
            contentContainerStyle={{ gap: 6 }}
          >
            {item.keywords.map((kw, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: '#f3e6f3',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#6e226e' }}>
                  {kw}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Stats & Date */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            <Text style={{ fontSize: 11, color: '#9e859e', marginLeft: 2 }}>likes</Text>
          </View>

          {!item.author_name && (
            <Text style={{ fontSize: 10, color: '#9e859e' }}>
              {formatDate(item.publishedAt)}
            </Text>
          )}
        </View>

        {/* View Original Button */}
        {item.permalink && (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.permalink)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: platformColor,
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 12,
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>
              View on {item.platform?.charAt(0).toUpperCase() + item.platform?.slice(1)}
            </Text>
            <ExternalLinkIcon size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ============================================
// MAIN SCREEN
// ============================================

export default function SentimentDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, keyword, sentiment, hash } = useLocalSearchParams();

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const isSmallDevice = height < 700;
  const sentimentConfig = getSentimentConfig(sentiment);
  const hashValue = hash || id;

  // Decode keyword if it was encoded
  const decodedKeyword = keyword ? decodeURIComponent(keyword) : '';

  const fetchContent = async (pageNum = 1, refresh = false) => {
    try {
      if (pageNum === 1) {
        refresh ? setRefreshing(true) : setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError('');

      const headers = await getHeaders();

      // FIXED: Use comments/keywords endpoint instead of contents/keywords
      const url = `${BASE_URL}/comments/keywords?page=${pageNum}&perPage=10&hash=${hashValue}&keyword=${encodeURIComponent(decodedKeyword)}&sentiment=${sentiment}`;
      
      console.log('Fetching comments:', url);

      const response = await fetch(url, { 
        method: 'GET',
        headers 
      });
      
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (data.success) {
        // FIXED: Extract comments from nested structure (data[0].comments)
        const allComments = (data.data || []).reduce((acc, item) => {
          return [...acc, ...(item.comments || [])];
        }, []);

        console.log('Extracted comments count:', allComments.length);

        if (pageNum === 1) {
          setComments(allComments);
        } else {
          setComments((prev) => [...prev, ...allComments]);
        }
        
        // Note: totalItems in API response seems to indicate number of keyword groups, not comments
        // We'll calculate based on actual comments
        setTotalPages(data.pageInfo?.totalPages || 1);
        setTotalItems(allComments.length);
        setPage(pageNum);
      } else {
        setError(data.message || 'Failed to load comments');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load comments');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (hashValue && decodedKeyword && sentiment) {
      fetchContent(1);
    }
  }, [hashValue, decodedKeyword, sentiment]);

  const handleRefresh = () => fetchContent(1, true);

  const handleLoadMore = () => {
    if (!isLoadingMore && page < totalPages) {
      fetchContent(page + 1);
    }
  };

  // Calculate totals
  const totalLikes = comments.reduce((sum, item) => sum + (Number(item.likes) || 0), 0);

  // Loading State
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#faf8fa', alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 20,
            backgroundColor: sentimentConfig.bg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 28 }}>{sentimentConfig.icon}</Text>
        </View>
        <ActivityIndicator size="large" color={sentimentConfig.color} />
        <Text style={{ marginTop: 12, color: '#9e859e', fontSize: 13, fontWeight: '600' }}>
          Loading "{decodedKeyword}" comments...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#faf8fa' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top || StatusBar.currentHeight || 0,
          paddingBottom: 20,
          paddingHorizontal: 16,
          backgroundColor: sentimentConfig.color,
          overflow: 'hidden',
        }}
      >
        {/* Background Decorations */}
        <View
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: 'rgba(255,255,255,0.08)',
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BackIcon size={18} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{ fontSize: isSmallDevice ? 18 : 20, fontWeight: '800', color: '#fff' }}
              numberOfLines={1}
            >
              "{decodedKeyword}"
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              {sentimentConfig.label} • {comments.length} comments found
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <Text style={{ fontSize: 18 }}>{sentimentConfig.icon}</Text>
          </View>
        </View>
      </View>

      {/* Stats Bar */}
      <View
        style={{
          flexDirection: 'row',
          padding: 12,
          paddingHorizontal: 16,
          gap: 12,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#ede4ed',
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: sentimentConfig.bg,
            borderRadius: 12,
            padding: 14,
            alignItems: 'center',
          }}
        >
          <CommentIcon size={20} color={sentimentConfig.color} />
          <Text style={{ fontSize: 20, fontWeight: '800', color: sentimentConfig.color, marginTop: 6 }}>
            {formatNumber(comments.length)}
          </Text>
          <Text style={{ fontSize: 11, color: '#9e859e', fontWeight: '600' }}>Comments</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fef2f2',
            borderRadius: 12,
            padding: 14,
            alignItems: 'center',
          }}
        >
          <HeartIcon size={20} color="#e8365d" />
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#e8365d', marginTop: 6 }}>
            {formatNumber(totalLikes)}
          </Text>
          <Text style={{ fontSize: 11, color: '#9e859e', fontWeight: '600' }}>Total Likes</Text>
        </View>
      </View>

      {/* Error State */}
      {error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 20,
              backgroundColor: '#fff0f3',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 28 }}>⚠️</Text>
          </View>
          <Text style={{ color: '#e8365d', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchContent(1)}
            style={{
              backgroundColor: sentimentConfig.color,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item, index) => `${item.id || item.comment_id || index}-${index}`}
          renderItem={({ item }) => <CommentCard item={item} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[sentimentConfig.color]}
              tintColor={sentimentConfig.color}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={sentimentConfig.color} />
              </View>
            ) : page < totalPages ? (
              <TouchableOpacity
                onPress={handleLoadMore}
                style={{
                  backgroundColor: sentimentConfig.bg,
                  padding: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                <Text style={{ color: sentimentConfig.color, fontWeight: '700' }}>Load More</Text>
              </TouchableOpacity>
            ) : comments.length > 0 ? (
              <Text style={{ textAlign: 'center', color: '#9e859e', fontSize: 12, marginTop: 16 }}>
                All {comments.length} comments loaded
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 20,
                  backgroundColor: sentimentConfig.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 28 }}>📭</Text>
              </View>
              <Text style={{ color: '#1a0a1a', fontSize: 14, fontWeight: '700', marginBottom: 4 }}>
                No comments found
              </Text>
              <Text style={{ color: '#9e859e', fontSize: 12, textAlign: 'center' }}>
                No {sentiment} comments found for "{decodedKeyword}"
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}