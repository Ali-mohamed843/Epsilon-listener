import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

const PLATFORM_TYPES = [
  'facebook-profile',
  'instagram-profile',
  'twitter-profile',
  'linkedin-profile',
  'tiktok-profile',
  'youtube-profile',
  'snapchat-profile',
];

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const fetchType = async (type, page, perPage, search) => {
  const headers = await getHeaders();
  const response = await fetch(
    `${BASE_URL}/shows?page=${page}&perPage=${perPage}&search=${encodeURIComponent(search)}&type=${type}`,
    { method: 'GET', headers }
  );
  const data = await response.json();
  return data.success && data.shows ? data.shows : [];
};

export const fetchAllProfiles = async (page = 1, perPage = 50, search = '') => {
  try {
    const results = await Promise.all(
      PLATFORM_TYPES.map((type) => fetchType(type, page, perPage, search))
    );
    const allShows = results.flat();
    return { success: true, data: allShows };
  } catch (error) {
    return { success: false, message: error.message };
  }
};