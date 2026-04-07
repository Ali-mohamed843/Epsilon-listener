import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = () => AsyncStorage.getItem('authToken');

export const clearAuth = async () => {
  await AsyncStorage.multiRemove(['authToken', 'userData']);
};

// Attach to any API call — returns true if the response was 401
export const isUnauthorized = (status) => status === 401;