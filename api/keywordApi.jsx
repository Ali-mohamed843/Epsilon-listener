import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

export const fetchKeywords = async (page = 1, perPage = 20, search = '') => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json' };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/shows?page=${page}&perPage=${perPage}&search=${encodeURIComponent(search)}&type=keyword`, {
      method: 'GET',
      headers,
    });
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch keywords');
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};