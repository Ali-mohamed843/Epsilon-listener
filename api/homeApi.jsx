import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const apiFetch = async (url, options = {}) => {
  const headers = await getAuthHeaders();
  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    await AsyncStorage.multiRemove(['authToken', 'userData']);
    router.replace('/auth/login');
    throw new Error('Session expired. Please log in again.');
  }

  return response;
};

export async function fetchShows({ type = 'keyword', page = 1, perPage = 10, search = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    search,
    searchHash: '',
    type,
  });

  const response = await apiFetch(`${BASE_URL}/shows?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch shows (${type}): ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(`API error while fetching shows (${type})`);
  }

  return {
    shows:    data.shows    || [],
    pageInfo: data.pageInfo || { totalItems: 0, totalPages: 0, currentPage: 1 },
  };
}

export async function fetchDashboards() {
  const response = await apiFetch(`${BASE_URL}/dashboards`);

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboards: ${response.status}`);
  }

  const data = await response.json();
  return data.dashboards || data || [];
}

const PROFILE_TYPES = [
  'facebook-profile',
  'instagram-profile',
  'twitter-profile',
  'linkedin-profile',
  'tiktok-profile',
  'youtube-profile',
  'snapchat-profile',
];

export async function fetchHomeData({ perPage = 10 } = {}) {
  const [keywordResult, ...profileResults] = await Promise.allSettled([
    fetchShows({ type: 'keyword', page: 1, perPage }),
    ...PROFILE_TYPES.map((type) => fetchShows({ type, page: 1, perPage: 1 })), // perPage:1 is enough, we only need totalItems
  ]);

  if (keywordResult.status === 'rejected') throw keywordResult.reason;

  const totalProfiles = profileResults.reduce((sum, result) => {
    if (result.status === 'fulfilled') {
      return sum + (result.value.pageInfo?.totalItems || 0);
    }
    return sum;
  }, 0);

  const dashboardsResult = await fetchDashboards().catch(() => []);

  return {
    keywordShows:    keywordResult.value.shows,
    keywordPageInfo: keywordResult.value.pageInfo,
    profilePageInfo: { totalItems: totalProfiles }, 
    dashboards: Array.isArray(dashboardsResult) ? dashboardsResult : [],
  };
}

export function getEngagementMeta(state) {
  switch (state) {
    case 'hot':  return { label: 'Hot',  color: '#e8365d' };
    case 'warm': return { label: 'Warm', color: '#f59e0b' };
    case 'cold': return { label: 'Cold', color: '#3b82f6' };
    default:     return { label: state ?? 'Unknown', color: '#9e859e' };
  }
}

export function getShowTypeLabel(type) {
  const map = {
    'keyword':             'Keyword',
    'facebook-profile':    'Facebook',
    'instagram-profile':   'Instagram',
    'twitter-profile':     'Twitter / X',
    'youtube-profile':     'YouTube',
    'linkedin-profile':    'LinkedIn',
    'tiktok-profile':      'TikTok',
  };
  return map[type] || type;
}

export function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}