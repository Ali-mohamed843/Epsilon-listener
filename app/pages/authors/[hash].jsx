import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  FlatList,
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

const UserIcon = ({ size = 24, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
  </Svg>
);

const FileTextIcon = ({ size = 16, color = '#6e226e' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Svg>
);

const MessageIcon = ({ size = 16, color = '#00a878' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

const getPlatformColor = (platform) => {
  const colors = {
    facebook: '#1877f2',
    instagram: '#e1306c',
    twitter: '#1da1f2',
    tiktok: '#000000',
    youtube: '#ff0000',
    linkedin: '#0077b5',
    all: '#6e226e',
  };
  return colors[platform?.toLowerCase()] || '#6e226e';
};

const AuthorCard = ({ author, index }) => {
  const isTop3 = index < 3;
  const medalColors = ['#ffd700', '#c0c0c0', '#cd7f32'];

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 10,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: 'rgba(110,34,110,0.06)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
        borderLeftWidth: isTop3 ? 4 : 0,
        borderLeftColor: isTop3 ? medalColors[index] : 'transparent',
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: isTop3 ? medalColors[index] : '#f3e6f3',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '800',
            color: isTop3 ? '#fff' : '#6e226e',
          }}
        >
          {index + 1}
        </Text>
      </View>

      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: '#f3e6f3',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#6e226e' }}>
          {author.name?.charAt(0) || '?'}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a0a1a' }} numberOfLines={1}>
          {author.name || 'Unknown Author'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <FileTextIcon size={14} color="#6e226e" />
            <Text style={{ fontSize: 12, color: '#9e859e' }}>
              <Text style={{ fontWeight: '700', color: '#1a0a1a' }}>
                {formatNumber(author.total_contents_count)}
              </Text>{' '}
              posts
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MessageIcon size={14} color="#00a878" />
            <Text style={{ fontSize: 12, color: '#9e859e' }}>
              <Text style={{ fontWeight: '700', color: '#1a0a1a' }}>
                {formatNumber(author.total_comments_count)}
              </Text>{' '}
              comments
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function AuthorsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { hash, name } = useLocalSearchParams();

  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const platforms = ['all', 'facebook', 'instagram', 'twitter', 'tiktok', 'youtube'];

  const fetchAuthors = async (platform = 'all', refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setIsLoading(true);
      setError('');

      const token = await AsyncStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = `${BASE_URL}/shows/${hash}/authors`;
      if (platform && platform !== 'all') {
        url += `?platform=${platform}`;
      }

      const response = await fetch(url, { headers });
      const data = await response.json();

      if (data.success !== false) {
        setAuthors(data.authors || []);
      } else {
        setError(data.message || 'Failed to load authors');
      }
    } catch (err) {
      setError(err.message || 'Failed to load authors');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (hash) fetchAuthors(selectedPlatform);
  }, [hash, selectedPlatform]);

  const handleRefresh = () => fetchAuthors(selectedPlatform, true);

  const PlatformFilter = ({ platform }) => {
    const isSelected = selectedPlatform === platform;
    const color = getPlatformColor(platform);

    return (
      <TouchableOpacity
        onPress={() => setSelectedPlatform(platform)}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: isSelected ? color : '#f3e6f3',
          marginRight: 8,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: isSelected ? '#fff' : '#6e226e',
            textTransform: 'capitalize',
          }}
        >
          {platform === 'all' ? 'All Platforms' : platform}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#faf8fa', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#6e226e" />
        <Text style={{ marginTop: 12, color: '#9e859e' }}>Loading authors...</Text>
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
              Authors
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              {authors.length} authors found
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#ede4ed',
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {platforms.map((platform) => (
            <PlatformFilter key={platform} platform={platform} />
          ))}
        </ScrollView>
      </View>

      <View style={{ flexDirection: 'row', padding: 16, gap: 10 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#6e226e' }}>
            {formatNumber(authors.reduce((sum, a) => sum + Number(a.total_contents_count || 0), 0))}
          </Text>
          <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 2 }}>Total Posts</Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#00a878' }}>
            {formatNumber(authors.reduce((sum, a) => sum + Number(a.total_comments_count || 0), 0))}
          </Text>
          <Text style={{ fontSize: 11, color: '#9e859e', marginTop: 2 }}>Total Comments</Text>
        </View>
      </View>

      {error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: '#e8365d', fontSize: 14, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchAuthors(selectedPlatform)}
            style={{
              marginTop: 16,
              backgroundColor: '#6e226e',
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
          data={authors}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item, index }) => <AuthorCard author={item} index={index} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#6e226e']} />
          }
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <UserIcon size={48} color="#9e859e" />
              <Text style={{ color: '#9e859e', fontSize: 14, marginTop: 12 }}>No authors found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}