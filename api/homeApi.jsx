import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

/**
 * Read the stored auth token and return ready-to-use headers.
 */
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Central fetch wrapper — handles 401 token expiry globally.
 */
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

/**
 * Fetch paginated shows by type.
 */
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

/**
 * Fetch all dashboards.
 */
export async function fetchDashboards() {
  const response = await apiFetch(`${BASE_URL}/dashboards`);

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboards: ${response.status}`);
  }

  const data = await response.json();
  return data.dashboards || data || [];
}

/**
 * Fetch all home data in parallel.
 */
export async function fetchHomeData({ perPage = 10 } = {}) {
  const [keywordResult, profileResult, dashboardsResult] = await Promise.allSettled([
    fetchShows({ type: 'keyword',          page: 1, perPage }),
    fetchShows({ type: 'facebook-profile', page: 1, perPage }),
    fetchDashboards(),
  ]);

  if (keywordResult.status === 'rejected') throw keywordResult.reason;
  if (profileResult.status === 'rejected') throw profileResult.reason;

  return {
    keywordShows:    keywordResult.value.shows,
    keywordPageInfo: keywordResult.value.pageInfo,
    profileShows:    profileResult.value.shows,
    profilePageInfo: profileResult.value.pageInfo,
    dashboards: dashboardsResult.status === 'fulfilled' ? dashboardsResult.value : [],
  };
}

/** Map a show's engagementState to a label and color. */
export function getEngagementMeta(state) {
  switch (state) {
    case 'hot':  return { label: 'Hot',  color: '#e8365d' };
    case 'warm': return { label: 'Warm', color: '#f59e0b' };
    case 'cold': return { label: 'Cold', color: '#3b82f6' };
    default:     return { label: state ?? 'Unknown', color: '#9e859e' };
  }
}

/** Return a short display type label for a show. */
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

/** Format a date string to a readable short date. */
export function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}