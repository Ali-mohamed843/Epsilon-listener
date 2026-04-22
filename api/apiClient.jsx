import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const BASE_URL = 'https://listener-api.epsilonfinder.com/admin/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('authToken');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    await AsyncStorage.multiRemove(['authToken', 'userData']);
    router.replace('/login');
    throw new Error('Session expired. Please log in again.');
  }

  return response;
};